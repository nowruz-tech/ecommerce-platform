import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Analytics Types
interface SalesAnalytics {
  daily: { date: string; revenue: number; orders: number }[];
  weekly: { week: string; revenue: number; orders: number }[];
  monthly: { month: string; revenue: number; orders: number }[];
  yearly: { year: string; revenue: number; orders: number }[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
}

interface ProductAnalytics {
  topSelling: { product: any; quantity: number; revenue: number }[];
  lowStock: { product: any; currentStock: number }[];
  outOfStock: { product: any; lastSold: Date }[];
  categoryPerformance: { category: string; revenue: number; percentage: number }[];
  brandPerformance: { brand: string; revenue: number; percentage: number }[];
}

interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  averageLifetimeValue: number;
  topCustomers: { customer: any; totalSpent: number; orders: number }[];
  geographicDistribution: { country: string; customers: number }[];
}

interface ConversionAnalytics {
  visitors: number;
  conversionRate: number;
  cartAbandonmentRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  topLandingPages: { page: string; visitors: number; conversions: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
}

interface MarketingAnalytics {
  couponUsage: { coupon: string; usageCount: number; totalDiscount: number }[];
  campaignPerformance: { campaign: string; impressions: number; clicks: number; conversions: number }[];
  referralSources: { source: string; visitors: number; conversions: number }[];
  emailCampaigns: { campaign: string; sent: number; opened: number; clicked: number }[];
}

// Analytics Service
export class AnalyticsService {
  // Sales Analytics
  async getSalesAnalytics(startDate: Date, endDate: Date): Promise<SalesAnalytics> {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: 'CANCELLED' },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Calculate daily data
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { revenue: 0, orders: 0 };
      dailyMap.set(date, {
        revenue: existing.revenue + Number(order.total),
        orders: existing.orders + 1,
      });
    });

    const daily = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    // Calculate monthly data
    const monthlyMap = new Map<string, { revenue: number; orders: number }>();
    orders.forEach((order) => {
      const month = order.createdAt.toISOString().substring(0, 7);
      const existing = monthlyMap.get(month) || { revenue: 0, orders: 0 };
      monthlyMap.set(month, {
        revenue: existing.revenue + Number(order.total),
        orders: existing.orders + 1,
      });
    });

    const monthly = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      ...data,
    }));

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth rate (compare with previous period)
    const periodLength = endDate.getTime() - startDate.getTime();
    const previousStart = new Date(startDate.getTime() - periodLength);
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStart,
          lt: startDate,
        },
        status: { not: 'CANCELLED' },
      },
      select: { total: true },
    });

    const previousRevenue = previousOrders.reduce(
      (sum, o) => sum + Number(o.total),
      0
    );
    const growthRate =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    return {
      daily,
      weekly: [], // Calculate similarly
      monthly,
      yearly: [],
      totalRevenue,
      totalOrders,
      averageOrderValue,
      growthRate,
    };
  }

  // Product Analytics
  async getProductAnalytics(): Promise<ProductAnalytics> {
    // Top selling products
    const topSelling = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    });

    const topSellingWithProducts = await Promise.all(
      topSelling.map(async (item) => ({
        product: await prisma.product.findUnique({
          where: { id: item.productId! },
          include: { category: true, brand: true },
        }),
        quantity: item._sum.quantity || 0,
        revenue: Number(item._sum.total || 0),
      }))
    );

    // Low stock products
    const lowStock = await prisma.product.findMany({
      where: {
        isActive: true,
        trackQuantity: true,
        quantity: { gt: 0, lte: 10 },
      },
      take: 10,
    });

    // Out of stock products
    const outOfStock = await prisma.product.findMany({
      where: {
        isActive: true,
        trackQuantity: true,
        quantity: 0,
      },
      take: 10,
    });

    // Category performance
    const categoryPerformance = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { total: true },
    });

    const categoryMap = new Map<string, number>();
    for (const item of categoryPerformance) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId! },
        select: { category: { select: { name: true } } },
      });
      if (product?.category) {
        const existing = categoryMap.get(product.category.name) || 0;
        categoryMap.set(
          product.category.name,
          existing + Number(item._sum.total || 0)
        );
      }
    }

    const totalCategoryRevenue = Array.from(categoryMap.values()).reduce(
      (sum, v) => sum + v,
      0
    );

    const categoryPerformanceArray = Array.from(categoryMap.entries()).map(
      ([category, revenue]) => ({
        category,
        revenue,
        percentage: totalCategoryRevenue > 0 ? (revenue / totalCategoryRevenue) * 100 : 0,
      })
    );

    return {
      topSelling: topSellingWithProducts,
      lowStock: lowStock.map((p) => ({ product: p, currentStock: p.quantity })),
      outOfStock: outOfStock.map((p) => ({
        product: p,
        lastSold: p.updatedAt,
      })),
      categoryPerformance: categoryPerformanceArray,
      brandPerformance: [], // Calculate similarly
    };
  }

  // Customer Analytics
  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalCustomers, newCustomers, returningCustomers, topCustomers] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.user.count({
          where: {
            createdAt: { lt: thirtyDaysAgo },
            orders: { some: {} },
          },
        }),
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            _count: { select: { orders: true } },
            orders: {
              select: { total: true },
            },
          },
          orderBy: { orders: { _count: 'desc' } },
          take: 10,
        }),
      ]);

    const customerRetentionRate =
      totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

    const averageLifetimeValue =
      topCustomers.length > 0
        ? topCustomers.reduce(
            (sum, c) =>
              sum + c.orders.reduce((oSum, o) => oSum + Number(o.total), 0),
            0
          ) / topCustomers.length
        : 0;

    return {
      totalCustomers,
      newCustomers,
      returningCustomers,
      customerRetentionRate,
      averageLifetimeValue,
      topCustomers: topCustomers.map((c) => ({
        customer: { id: c.id, name: c.name, email: c.email },
        totalSpent: c.orders.reduce(
          (sum, o) => sum + Number(o.total),
          0
        ),
        orders: c._count.orders,
      })),
      geographicDistribution: [], // Calculate with geolocation data
    };
  }

  // Conversion Analytics
  async getConversionAnalytics(): Promise<ConversionAnalytics> {
    // Get analytics events
    const visitors = await prisma.analytics.count({
      where: { event: 'page_view' },
    });

    const conversions = await prisma.analytics.count({
      where: { event: 'purchase' },
    });

    const conversionRate =
      visitors > 0 ? (conversions / visitors) * 100 : 0;

    // Cart abandonment
    const carts = await prisma.analytics.count({
      where: { event: 'add_to_cart' },
    });

    const checkouts = await prisma.analytics.count({
      where: { event: 'checkout_start' },
    });

    const cartAbandonmentRate =
      carts > 0 ? ((carts - checkouts) / carts) * 100 : 0;

    return {
      visitors,
      conversionRate,
      cartAbandonmentRate,
      averageSessionDuration: 0,
      bounceRate: 0,
      topLandingPages: [],
      deviceBreakdown: [],
    };
  }

  // Marketing Analytics
  async getMarketingAnalytics(): Promise<MarketingAnalytics> {
    // Coupon usage
    const couponUsage = await prisma.coupon.findMany({
      select: {
        code: true,
        usedCount: true,
        orders: {
          select: { discountAmount: true },
        },
      },
      orderBy: { usedCount: 'desc' },
      take: 10,
    });

    return {
      couponUsage: couponUsage.map((c) => ({
        coupon: c.code,
        usageCount: c.usedCount,
        totalDiscount: c.orders.reduce(
          (sum, o) => sum + Number(o.discountAmount),
          0
        ),
      })),
      campaignPerformance: [],
      referralSources: [],
      emailCampaigns: [],
    };
  }

  // Track Event
  async trackEvent(data: {
    event: string;
    page: string;
    productId?: string;
    userId?: string;
    sessionId: string;
    metadata?: any;
  }) {
    return prisma.analytics.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  }

  // Get Real-time Stats
  async getRealTimeStats() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [onlineUsers, recentOrders, recentRevenue] = await Promise.all([
      prisma.analytics.count({
        where: {
          event: 'page_view',
          createdAt: { gte: oneHourAgo },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: oneHourAgo },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: oneHourAgo },
        },
        _sum: { total: true },
      }),
    ]);

    return {
      onlineUsers,
      recentOrders,
      recentRevenue: recentRevenue._sum.total || 0,
    };
  }
}

export const analyticsService = new AnalyticsService();
