import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Loyalty & Rewards Types
interface RewardPoint {
  id: string;
  userId: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired';
  description: string;
  orderId?: string;
  expiresAt: Date;
  createdAt: Date;
}

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  discountPercentage: number;
  pointsMultiplier: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeShipping' | 'giftCard' | 'product';
  value: number;
  isActive: boolean;
}

// Loyalty Service
export class LoyaltyService {
  // Loyalty Tiers
  private tiers: LoyaltyTier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      minPoints: 0,
      benefits: ['1x Points Multiplier', 'Birthday Bonus'],
      discountPercentage: 0,
      pointsMultiplier: 1,
    },
    {
      id: 'silver',
      name: 'Silver',
      minPoints: 1000,
      benefits: ['1.5x Points Multiplier', 'Free Shipping', 'Birthday Bonus'],
      discountPercentage: 5,
      pointsMultiplier: 1.5,
    },
    {
      id: 'gold',
      name: 'Gold',
      minPoints: 5000,
      benefits: ['2x Points Multiplier', 'Free Shipping', 'Early Access', 'Birthday Bonus'],
      discountPercentage: 10,
      pointsMultiplier: 2,
    },
    {
      id: 'platinum',
      name: 'Platinum',
      minPoints: 15000,
      benefits: ['3x Points Multiplier', 'Free Shipping', 'Early Access', 'VIP Support', 'Birthday Bonus'],
      discountPercentage: 15,
      pointsMultiplier: 3,
    },
  ];

  // Award Points
  async awardPoints(userId: string, points: number, description: string, orderId?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true, loyaltyTier: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get tier multiplier
    const tier = this.tiers.find((t) => t.name.toLowerCase() === user.loyaltyTier) || this.tiers[0];
    const adjustedPoints = Math.floor(points * tier.pointsMultiplier);

    // Create points record
    const pointsRecord = await prisma.loyaltyPoint.create({
      data: {
        userId,
        points: adjustedPoints,
        type: 'earned',
        description,
        orderId,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    // Update user total points
    await prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: {
          increment: adjustedPoints,
        },
      },
    });

    // Check tier upgrade
    await this.checkTierUpgrade(userId);

    return pointsRecord;
  }

  // Redeem Points
  async redeemPoints(userId: string, points: number, description: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true },
    });

    if (!user || user.loyaltyPoints < points) {
      throw new Error('Insufficient points');
    }

    const pointsRecord = await prisma.loyaltyPoint.create({
      data: {
        userId,
        points,
        type: 'redeemed',
        description,
        expiresAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: {
          decrement: points,
        },
      },
    });

    return pointsRecord;
  }

  // Calculate Order Points
  async calculateOrderPoints(userId: string, orderTotal: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyTier: true },
    });

    const tier = this.tiers.find((t) => t.name.toLowerCase() === user?.loyaltyTier) || this.tiers[0];
    
    // 1 point per dollar, multiplied by tier
    const basePoints = Math.floor(orderTotal);
    const adjustedPoints = Math.floor(basePoints * tier.pointsMultiplier);

    return adjustedPoints;
  }

  // Check Tier Upgrade
  async checkTierUpgrade(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true, loyaltyTier: true },
    });

    if (!user) return;

    let newTier = this.tiers[0];
    for (const tier of this.tiers) {
      if (user.loyaltyPoints >= tier.minPoints) {
        newTier = tier;
      }
    }

    if (newTier.name.toLowerCase() !== user.loyaltyTier) {
      await prisma.user.update({
        where: { id: userId },
        data: { loyaltyTier: newTier.name.toLowerCase() },
      });

      // Send notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'tier_upgrade',
          title: 'Tier Upgrade!',
          message: `Congratulations! You've been upgraded to ${newTier.name} tier.`,
        },
      });

      return newTier;
    }

    return null;
  }

  // Get Available Rewards
  async getAvailableRewards() {
    return prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' },
    });
  }

  // Redeem Reward
  async redeemReward(userId: string, rewardId: string) {
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.isActive) {
      throw new Error('Reward not found or inactive');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true },
    });

    if (!user || user.loyaltyPoints < reward.pointsCost) {
      throw new Error('Insufficient points');
    }

    // Deduct points
    await this.redeemPoints(userId, reward.pointsCost, `Redeemed: ${reward.name}`);

    // Create reward redemption
    const redemption = await prisma.rewardRedemption.create({
      data: {
        userId,
        rewardId,
        pointsUsed: reward.pointsCost,
        status: 'pending',
      },
    });

    // Process reward based on type
    switch (reward.type) {
      case 'discount':
        await prisma.userDiscount.create({
          data: {
            userId,
            amount: reward.value,
            type: 'percentage',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        break;
      case 'freeShipping':
        await prisma.userBenefit.create({
          data: {
            userId,
            type: 'free_shipping',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        break;
      case 'giftCard':
        await prisma.giftCard.create({
          data: {
            userId,
            code: `GIFT_${Date.now()}`,
            amount: reward.value,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
        break;
    }

    return redemption;
  }

  // Get User Loyalty Summary
  async getUserLoyaltySummary(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        loyaltyPoints: true,
        loyaltyTier: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentTier = this.tiers.find(
      (t) => t.name.toLowerCase() === user.loyaltyTier
    ) || this.tiers[0];

    const nextTier = this.tiers.find((t) => t.minPoints > user.loyaltyPoints);

    const [totalEarned, totalRedeemed, recentActivity] = await Promise.all([
      prisma.loyaltyPoint.aggregate({
        where: { userId, type: 'earned' },
        _sum: { points: true },
      }),
      prisma.loyaltyPoint.aggregate({
        where: { userId, type: 'redeemed' },
        _sum: { points: true },
      }),
      prisma.loyaltyPoint.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      currentPoints: user.loyaltyPoints,
      currentTier,
      nextTier,
      pointsToNextTier: nextTier ? nextTier.minPoints - user.loyaltyPoints : 0,
      totalEarned: totalEarned._sum.points || 0,
      totalRedeemed: totalRedeemed._sum.points || 0,
      recentActivity,
    };
  }

  // Process Birthday Bonus
  async processBirthdayBonus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profile: true },
    });

    if (user?.profile?.birthday) {
      const today = new Date();
      const birthday = new Date(user.profile.birthday);

      if (
        today.getMonth() === birthday.getMonth() &&
        today.getDate() === birthday.getDate()
      ) {
        // Check if bonus already awarded this year
        const existingBonus = await prisma.loyaltyPoint.findFirst({
          where: {
            userId,
            type: 'earned',
            description: { contains: 'Birthday Bonus' },
            createdAt: {
              gte: new Date(today.getFullYear(), 0, 1),
            },
          },
        });

        if (!existingBonus) {
          await this.awardPoints(userId, 100, 'Birthday Bonus');
        }
      }
    }
  }

  // Process Expired Points
  async processExpiredPoints() {
    const expiredPoints = await prisma.loyaltyPoint.findMany({
      where: {
        type: 'earned',
        expiresAt: { lt: new Date() },
      },
    });

    for (const point of expiredPoints) {
      await prisma.loyaltyPoint.update({
        where: { id: point.id },
        data: { type: 'expired' },
      });

      await prisma.user.update({
        where: { id: point.userId },
        data: {
          loyaltyPoints: {
            decrement: point.points,
          },
        },
      });
    }

    return expiredPoints.length;
  }
}

export const loyaltyService = new LoyaltyService();
