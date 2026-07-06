import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Multi-Vendor System Types
interface Vendor {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  rating: number;
  totalSales: number;
  commission: number;
  isVerified: boolean;
  isActive: boolean;
}

interface VendorProduct {
  id: string;
  vendorId: string;
  productId: string;
  sku: string;
  price: number;
  quantity: number;
  commission: number;
}

interface Commission {
  vendorId: string;
  orderId: string;
  amount: number;
  rate: number;
  status: 'pending' | 'approved' | 'paid';
}

// Multi-Vendor Service
export class VendorService {
  // Create Vendor Store
  async createVendor(data: {
    userId: string;
    name: string;
    slug: string;
    description?: string;
    commission?: number;
  }) {
    const vendor = await prisma.vendor.create({
      data: {
        ...data,
        userId: data.userId,
        rating: 0,
        totalSales: 0,
        commission: data.commission || 10,
        isVerified: false,
        isActive: true,
      },
    });

    // Create vendor profile
    await prisma.vendorProfile.create({
      data: {
        vendorId: vendor.id,
        businessType: 'individual',
        taxId: '',
        bankAccount: '',
      },
    });

    return vendor;
  }

  // Get Vendor Dashboard
  async getVendorDashboard(vendorId: string) {
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingPayouts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.vendorProduct.count({ where: { vendorId } }),
      prisma.orderItem.count({
        where: { product: { vendorId } },
      }),
      prisma.orderItem.aggregate({
        where: { product: { vendorId } },
        _sum: { total: true },
      }),
      prisma.vendorPayout.aggregate({
        where: { vendorId, status: 'pending' },
        _sum: { amount: true },
      }),
      prisma.orderItem.findMany({
        where: { product: { vendorId } },
        include: { order: true, product: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.vendorProduct.findMany({
        where: { vendorId },
        include: { product: true },
        orderBy: { sales: 'desc' },
        take: 5,
      }),
    ]);

    return {
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingPayouts: pendingPayouts._sum.amount || 0,
      },
      recentOrders,
      topProducts,
    };
  }

  // Add Product to Vendor Store
  async addVendorProduct(vendorId: string, data: {
    productId: string;
    sku: string;
    price: number;
    quantity: number;
    commission?: number;
  }) {
    return prisma.vendorProduct.create({
      data: {
        vendorId,
        ...data,
        commission: data.commission || 10,
        sales: 0,
      },
    });
  }

  // Calculate Commission
  async calculateCommission(orderId: string) {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true },
    });

    for (const item of orderItems) {
      if (item.product.vendorId) {
        const vendor = await prisma.vendor.findUnique({
          where: { id: item.product.vendorId },
        });

        if (vendor) {
          const commissionAmount = (Number(item.total) * vendor.commission) / 100;

          await prisma.vendorCommission.create({
            data: {
              vendorId: vendor.id,
              orderId,
              productId: item.productId,
              amount: commissionAmount,
              rate: vendor.commission,
              status: 'pending',
            },
          });
        }
      }
    }
  }

  // Process Payout
  async processPayout(vendorId: string) {
    const pendingCommissions = await prisma.vendorCommission.findMany({
      where: { vendorId, status: 'pending' },
    });

    const totalAmount = pendingCommissions.reduce(
      (sum, c) => sum + Number(c.amount),
      0
    );

    if (totalAmount > 0) {
      // Create payout record
      const payout = await prisma.vendorPayout.create({
        data: {
          vendorId,
          amount: totalAmount,
          status: 'processing',
          method: 'bank_transfer',
        },
      });

      // Update commission status
      await prisma.vendorCommission.updateMany({
        where: { id: { in: pendingCommissions.map((c) => c.id) } },
        data: { status: 'approved' },
      });

      // Simulate payment processing
      setTimeout(async () => {
        await prisma.vendorPayout.update({
          where: { id: payout.id },
          data: { status: 'completed' },
        });

        await prisma.vendorCommission.updateMany({
          where: { id: { in: pendingCommissions.map((c) => c.id) } },
          data: { status: 'paid' },
        });
      }, 5000);

      return payout;
    }

    return null;
  }
}

export const vendorService = new VendorService();
