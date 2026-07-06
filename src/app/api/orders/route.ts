import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (orderId) {
      // Get single order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          payments: true,
          shipments: true,
          statusHistory: true,
          invoice: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build filter
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    // Fetch orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      notes,
      couponCode,
    } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'User ID and items are required' },
        { status: 400 }
      );
    }

    // Validate products and calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.trackQuantity && product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      const itemTotal = price * item.quantity;
      const itemTax = itemTotal * (Number(product.taxRate) / 100);

      subtotal += itemTotal;
      taxAmount += itemTax;

      orderItems.push({
        name: product.name,
        sku: product.sku,
        price,
        quantity: item.quantity,
        total: itemTotal,
        image: product.images[0]?.url,
        productId: product.id,
        variantId: item.variantId,
      });
    }

    // Apply coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon && coupon.isActive && new Date(coupon.expiresAt) > new Date()) {
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return NextResponse.json(
            { error: 'Coupon usage limit reached' },
            { status: 400 }
          );
        }

        if (coupon.minimumAmount && subtotal < Number(coupon.minimumAmount)) {
          return NextResponse.json(
            { error: `Minimum order amount not met` },
            { status: 400 }
          );
        }

        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
          if (coupon.maximumDiscount && discountAmount > Number(coupon.maximumDiscount)) {
            discountAmount = Number(coupon.maximumDiscount);
          }
        } else {
          discountAmount = Number(coupon.discountValue);
        }

        // Increment coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    // Calculate shipping (simplified)
    const shippingAmount = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + taxAmount + shippingAmount - discountAmount;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: 'PENDING',
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
        fulfillmentStatus: 'UNFULFILLED',
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        total,
        notes,
        shippingAddress,
        userId,
        couponCode,
        items: {
          create: orderItems,
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            note: 'Order created',
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear user's cart
    await prisma.cart.deleteMany({
      where: { userId },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, paymentStatus, fulfillmentStatus } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: true,
        statusHistory: true,
      },
    });

    // Add status history
    if (status) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status,
          note: `Status updated to ${status}`,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
