import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Multi-Store Types
interface Store {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  banner?: string;
  description?: string;
  isActive: boolean;
  settings: StoreSettings;
}

interface StoreSettings {
  currency: string;
  language: string;
  timezone: string;
  taxRate: number;
  shippingEnabled: boolean;
  paymentMethods: string[];
  features: string[];
}

interface StoreProduct {
  id: string;
  storeId: string;
  productId: string;
  price: number;
  comparePrice?: number;
  quantity: number;
  isVisible: boolean;
  isFeatured: boolean;
}

// Multi-Store Service
export class MultiStoreService {
  // Create Store
  async createStore(data: {
    ownerId: string;
    name: string;
    slug: string;
    description?: string;
    domain?: string;
  }) {
    const store = await prisma.store.create({
      data: {
        ...data,
        ownerId: data.ownerId,
        isActive: true,
        settings: {
          currency: 'USD',
          language: 'en',
          timezone: 'UTC',
          taxRate: 0,
          shippingEnabled: true,
          paymentMethods: ['stripe', 'paypal'],
          features: ['basic'],
        },
      },
    });

    // Create default store settings
    await prisma.storeSettings.create({
      data: {
        storeId: store.id,
        theme: 'default',
        primaryColor: '#0ea5e9',
        customCss: '',
        socialLinks: {},
        seoSettings: {
          title: store.name,
          description: data.description || '',
        },
      },
    });

    return store;
  }

  // Get Store by Domain
  async getStoreByDomain(domain: string) {
    return prisma.store.findFirst({
      where: {
        OR: [{ domain }, { slug: domain }],
        isActive: true,
      },
      include: {
        settings: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Get Store Products
  async getStoreProducts(
    storeId: string,
    filters?: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const where: any = {
      storeId,
      isVisible: true,
    };

    if (filters?.category) {
      where.product = { category: { slug: filters.category } };
    }

    if (filters?.brand) {
      where.product = { ...where.product, brand: { slug: filters.brand } };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;

    const [products, total] = await Promise.all([
      prisma.storeProduct.findMany({
        where,
        include: {
          product: {
            include: {
              images: true,
              category: true,
              brand: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.storeProduct.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update Store Settings
  async updateStoreSettings(storeId: string, settings: Partial<StoreSettings>) {
    return prisma.storeSettings.update({
      where: { storeId },
      data: settings,
    });
  }

  // Get Store Analytics
  async getStoreAnalytics(storeId: string, period = '30d') {
    const startDate = new Date();
    if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90);

    const [orders, revenue, products] = await Promise.all([
      prisma.order.count({
        where: {
          storeId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.order.aggregate({
        where: {
          storeId,
          createdAt: { gte: startDate },
        },
        _sum: { total: true },
      }),
      prisma.storeProduct.count({ where: { storeId } }),
    ]);

    return {
      orders,
      revenue: revenue._sum.total || 0,
      products,
      period,
    };
  }

  // Clone Store
  async cloneStore(storeId: string, newOwnerId: string, newName: string) {
    const originalStore = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        products: true,
        settings: true,
      },
    });

    if (!originalStore) {
      throw new Error('Store not found');
    }

    // Create new store
    const newStore = await prisma.store.create({
      data: {
        name: newName,
        slug: newName.toLowerCase().replace(/\s+/g, '-'),
        ownerId: newOwnerId,
        description: originalStore.description,
        logo: originalStore.logo,
        banner: originalStore.banner,
        isActive: true,
        settings: originalStore.settings,
      },
    });

    // Clone products
    for (const product of originalStore.products) {
      await prisma.storeProduct.create({
        data: {
          storeId: newStore.id,
          productId: product.productId,
          price: product.price,
          comparePrice: product.comparePrice,
          quantity: product.quantity,
          isVisible: product.isVisible,
          isFeatured: product.isFeatured,
        },
      });
    }

    return newStore;
  }

  // Transfer Store Ownership
  async transferOwnership(storeId: string, newOwnerId: string) {
    return prisma.store.update({
      where: { id: storeId },
      data: { ownerId: newOwnerId },
    });
  }

  // Get Store Staff
  async getStoreStaff(storeId: string) {
    return prisma.storeStaff.findMany({
      where: { storeId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });
  }

  // Add Store Staff
  async addStoreStaff(storeId: string, userId: string, role: string) {
    return prisma.storeStaff.create({
      data: {
        storeId,
        userId,
        role,
        permissions: this.getDefaultPermissions(role),
      },
    });
  }

  // Get Default Permissions
  private getDefaultPermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      admin: ['*'],
      manager: [
        'products:read',
        'products:write',
        'orders:read',
        'orders:write',
        'customers:read',
        'analytics:read',
      ],
      editor: [
        'products:read',
        'products:write',
        'orders:read',
      ],
      viewer: [
        'products:read',
        'orders:read',
        'analytics:read',
      ],
    };
    return permissions[role] || permissions.viewer;
  }
}

export const multiStoreService = new MultiStoreService();
