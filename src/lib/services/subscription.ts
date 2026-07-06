import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Subscription Plans
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
}

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Subscription Service
export class SubscriptionService {
  // Get All Plans
  async getPlans() {
    return prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  // Create Subscription
  async createSubscription(userId: string, planId: string, paymentMethod: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    const now = new Date();
    const periodEnd = new Date(now);
    
    if (plan.interval === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Create subscription
    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        paymentMethod,
      },
    });

    // Process first payment
    await this.processPayment(subscription.id, plan.price);

    // Update user tier
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: plan.name.toLowerCase(),
      },
    });

    return subscription;
  }

  // Cancel Subscription
  async cancelSubscription(subscriptionId: string, immediate = false) {
    const subscription = await prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (immediate) {
      await prisma.userSubscription.update({
        where: { id: subscriptionId },
        data: { status: 'cancelled' },
      });

      await prisma.user.update({
        where: { id: subscription.userId },
        data: { subscriptionTier: null },
      });
    } else {
      await prisma.userSubscription.update({
        where: { id: subscriptionId },
        data: { cancelAtPeriodEnd: true },
      });
    }

    return subscription;
  }

  // Process Payment
  async processPayment(subscriptionId: string, amount: number) {
    // Simulate payment processing
    const payment = await prisma.subscriptionPayment.create({
      data: {
        subscriptionId,
        amount,
        status: 'completed',
        method: 'card',
        transactionId: `SUB_${Date.now()}`,
      },
    });

    return payment;
  }

  // Check Expiring Subscriptions
  async checkExpiringSubscriptions() {
    const now = new Date();
    const expiringSoon = new Date(now);
    expiringSoon.setDate(expiringSoon.getDate() + 3);

    const expiring = await prisma.userSubscription.findMany({
      where: {
        status: 'active',
        currentPeriodEnd: {
          lte: expiringSoon,
          gte: now,
        },
      },
      include: { user: true, plan: true },
    });

    for (const sub of expiring) {
      // Send reminder notification
      await prisma.notification.create({
        data: {
          userId: sub.userId,
          type: 'subscription_reminder',
          title: 'Subscription Expiring Soon',
          message: `Your ${sub.plan.name} subscription will expire on ${sub.currentPeriodEnd.toLocaleDateString()}.`,
        },
      });
    }

    return expiring;
  }

  // Renew Subscription
  async renewSubscription(subscriptionId: string) {
    const subscription = await prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const now = new Date();
    const periodEnd = new Date(now);
    
    if (subscription.plan.interval === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    await prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
    });

    await this.processPayment(subscriptionId, subscription.plan.price);

    return subscription;
  }

  // Get User Subscription
  async getUserSubscription(userId: string) {
    return prisma.userSubscription.findFirst({
      where: { userId, status: 'active' },
      include: { plan: true },
    });
  }

  // Check Subscription Benefits
  async checkBenefits(userId: string) {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      return {
        hasFreeShipping: false,
        hasEarlyAccess: false,
        hasExclusiveDiscounts: false,
        discountPercentage: 0,
      };
    }

    const benefits = subscription.plan.features;
    
    return {
      hasFreeShipping: benefits.includes('free_shipping'),
      hasEarlyAccess: benefits.includes('early_access'),
      hasExclusiveDiscounts: benefits.includes('exclusive_discounts'),
      discountPercentage: benefits.includes('premium_discount') ? 15 : 
                          benefits.includes('plus_discount') ? 10 : 0,
    };
  }
}

export const subscriptionService = new SubscriptionService();
