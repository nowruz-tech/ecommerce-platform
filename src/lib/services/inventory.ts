import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Inventory Types
interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  reorderPoint: number;
  reorderQuantity: number;
  warehouse?: string;
  location?: string;
  lastRestocked: Date;
  lastSold: Date;
  cost: number;
  supplier?: string;
}

interface StockMovement {
  id: string;
  productId: string;
  variantId?: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring';
  productId: string;
  currentQuantity: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  createdAt: Date;
}

// Inventory Service
export class InventoryService {
  // Get Inventory Items
  async getInventoryItems(filters?: {
    lowStock?: boolean;
    outOfStock?: boolean;
    warehouse?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.lowStock) {
      where.quantity = { gt: 0, lte: where.lowStockThreshold || 10 };
    }

    if (filters?.outOfStock) {
      where.quantity = 0;
    }

    if (filters?.warehouse) {
      where.warehouse = filters.warehouse;
    }

    if (filters?.search) {
      where.OR = [
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { product: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    return prisma.inventoryItem.findMany({
      where,
      include: {
        product: true,
        variant: true,
      },
      orderBy: { quantity: 'asc' },
    });
  }

  // Update Stock
  async updateStock(
    productId: string,
    quantity: number,
    type: 'in' | 'out' | 'adjustment',
    options?: {
      variantId?: string;
      reference?: string;
      notes?: string;
      createdBy: string;
    }
  ) {
    const where = options?.variantId
      ? { productId_variantId: { productId, variantId: options.variantId } }
      : { productId };

    const current = await prisma.inventoryItem.findUnique({ where });

    if (!current) {
      throw new Error('Inventory item not found');
    }

    let newQuantity = current.quantity;
    switch (type) {
      case 'in':
        newQuantity += quantity;
        break;
      case 'out':
        if (current.quantity < quantity) {
          throw new Error('Insufficient stock');
        }
        newQuantity -= quantity;
        break;
      case 'adjustment':
        newQuantity = quantity;
        break;
    }

    // Update inventory
    const updated = await prisma.inventoryItem.update({
      where,
      data: {
        quantity: newQuantity,
        lastSold: type === 'out' ? new Date() : current.lastSold,
        lastRestocked: type === 'in' ? new Date() : current.lastRestocked,
      },
    });

    // Record stock movement
    await prisma.stockMovement.create({
      data: {
        productId,
        variantId: options?.variantId,
        type,
        quantity,
        reference: options?.reference,
        notes: options?.notes,
        createdBy: options?.createdBy || 'system',
      },
    });

    // Check for alerts
    await this.checkStockAlerts(productId, options?.variantId);

    return updated;
  }

  // Reserve Stock (for pending orders)
  async reserveStock(productId: string, quantity: number, orderId: string) {
    const item = await prisma.inventoryItem.findUnique({
      where: { productId },
    });

    if (!item) {
      throw new Error('Inventory item not found');
    }

    const available = item.quantity - item.reservedQuantity;
    if (available < quantity) {
      throw new Error('Insufficient available stock');
    }

    return prisma.inventoryItem.update({
      where: { productId },
      data: {
        reservedQuantity: { increment: quantity },
      },
    });
  }

  // Release Reserved Stock
  async releaseReservedStock(productId: string, quantity: number) {
    return prisma.inventoryItem.update({
      where: { productId },
      data: {
        reservedQuantity: { decrement: quantity },
      },
    });
  }

  // Check Stock Alerts
  async checkStockAlerts(productId: string, variantId?: string) {
    const where = variantId
      ? { productId_variantId: { productId, variantId } }
      : { productId };

    const item = await prisma.inventoryItem.findUnique({ where });

    if (!item) return;

    const alerts: InventoryAlert[] = [];

    // Out of stock
    if (item.quantity === 0) {
      alerts.push({
        id: `alert_${Date.now()}`,
        type: 'out_of_stock',
        productId,
        currentQuantity: 0,
        threshold: item.lowStockThreshold,
        severity: 'critical',
        acknowledged: false,
        createdAt: new Date(),
      });
    }
    // Low stock
    else if (item.quantity <= item.lowStockThreshold) {
      alerts.push({
        id: `alert_${Date.now()}`,
        type: 'low_stock',
        productId,
        currentQuantity: item.quantity,
        threshold: item.lowStockThreshold,
        severity: item.quantity <= item.lowStockThreshold / 2 ? 'high' : 'medium',
        acknowledged: false,
        createdAt: new Date(),
      });
    }

    // Create alerts
    for (const alert of alerts) {
      await prisma.inventoryAlert.create({
        data: alert,
      });

      // Send notification to admin
      await prisma.notification.create({
        data: {
          userId: 'admin',
          type: 'inventory_alert',
          title: `Stock Alert: ${alert.type.replace('_', ' ').toUpperCase()}`,
          message: `Product ${productId} ${alert.type.replace('_', ' ')}: ${item.quantity} units remaining.`,
          data: { productId, variantId, alertType: alert.type },
        },
      });
    }

    return alerts;
  }

  // Auto Reorder
  async checkReorderPoints() {
    const itemsNeedingReorder = await prisma.inventoryItem.findMany({
      where: {
        quantity: { lte: prisma.raw('reorder_point') },
        isActive: true,
      },
      include: { product: true },
    });

    const reorderRequests = [];

    for (const item of itemsNeedingReorder) {
      // Create purchase order
      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          supplierId: item.supplier || 'default',
          status: 'pending',
          totalCost: item.cost * item.reorderQuantity,
          items: {
            create: {
              productId: item.productId,
              quantity: item.reorderQuantity,
              unitCost: item.cost,
            },
          },
        },
      });

      reorderRequests.push({
        item,
        purchaseOrder,
      });

      // Notify admin
      await prisma.notification.create({
        data: {
          userId: 'admin',
          type: 'reorder_request',
          title: 'Auto Reorder Triggered',
          message: `${item.product.name} needs restocking. Quantity: ${item.quantity}, Reorder: ${item.reorderQuantity}`,
          data: {
            productId: item.productId,
            purchaseOrderId: purchaseOrder.id,
          },
        },
      });
    }

    return reorderRequests;
  }

  // Transfer Stock Between Warehouses
  async transferStock(
    productId: string,
    fromWarehouse: string,
    toWarehouse: string,
    quantity: number
  ) {
    // Remove from source
    await this.updateStock(productId, quantity, 'out', {
      reference: `Transfer to ${toWarehouse}`,
      notes: `Stock transfer`,
      createdBy: 'system',
    });

    // Add to destination
    await this.updateStock(productId, quantity, 'in', {
      reference: `Transfer from ${fromWarehouse}`,
      notes: `Stock transfer`,
      createdBy: 'system',
    });

    // Record transfer
    return prisma.stockTransfer.create({
      data: {
        productId,
        fromWarehouse,
        toWarehouse,
        quantity,
        status: 'completed',
      },
    });
  }

  // Get Stock History
  async getStockHistory(productId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.stockMovement.findMany({
      where: {
        productId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get Inventory Valuation
  async getInventoryValuation() {
    const items = await prisma.inventoryItem.findMany({
      include: { product: true },
    });

    const valuation = items.reduce(
      (acc, item) => {
        const value = item.quantity * item.cost;
        return {
          totalItems: acc.totalItems + item.quantity,
          totalValue: acc.totalValue + value,
          byCategory: {
            ...acc.byCategory,
            [item.product.categoryId]: (acc.byCategory[item.product.categoryId] || 0) + value,
          },
        };
      },
      { totalItems: 0, totalValue: 0, byCategory: {} as Record<string, number> }
    );

    return valuation;
  }

  // Bulk Update Stock
  async bulkUpdateStock(updates: { productId: string; quantity: number }[]) {
    const results = [];

    for (const update of updates) {
      try {
        const result = await this.updateStock(
          update.productId,
          update.quantity,
          'adjustment',
          {
            reference: 'Bulk update',
            createdBy: 'system',
          }
        );
        results.push({ productId: update.productId, success: true, result });
      } catch (error) {
        results.push({
          productId: update.productId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  // Get Alerts
  async getAlerts(acknowledged = false) {
    return prisma.inventoryAlert.findMany({
      where: { acknowledged },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Acknowledge Alert
  async acknowledgeAlert(alertId: string) {
    return prisma.inventoryAlert.update({
      where: { id: alertId },
      data: { acknowledged: true },
    });
  }
}

export const inventoryService = new InventoryService();
