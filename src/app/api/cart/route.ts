import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const guestId = searchParams.get('guestId');

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: 'User ID or Guest ID is required' },
        { status: 400 }
      );
    }

    const where = userId ? { userId } : { guestId };

    const cartItems = await prisma.cart.findMany({
      where,
      include: {
        product: {
          include: {
            images: true,
            category: true,
            brand: true,
          },
        },
        variant: true,
        coupon: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.variant?.price || item.product.price;
      return total + Number(price) * item.quantity;
    }, 0);

    const taxRate = 0.15;
    const tax = subtotal * taxRate;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const discount = cartItems.reduce((total, item) => {
      if (item.coupon) {
        if (item.coupon.discountType === 'PERCENTAGE') {
          return total + (Number(item.product.price) * item.quantity * Number(item.coupon.discountValue)) / 100;
        }
        return total + Number(item.coupon.discountValue);
      }
      return total;
    }, 0);

    const total = subtotal + tax + shipping - discount;

    return NextResponse.json({
      items: cartItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, guestId, productId, variantId, quantity = 1, couponCode } = body;

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: 'User ID or Guest ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.trackQuantity && product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if variant exists if provided
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        );
      }

      if (variant.quantity < quantity) {
        return NextResponse.json(
          { error: 'Insufficient variant stock' },
          { status: 400 }
        );
      }
    }

    // Check if item already in cart
    const existingItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: true,
          variant: true,
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cart.create({
        data: {
          userId,
          guestId,
          productId,
          variantId,
          quantity,
          couponCode,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/cart
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      // Remove item if quantity is 0 or less
      await prisma.cart.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: 'Item removed' });
    }

    const cartItem = await prisma.cart.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
        variant: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const userId = searchParams.get('userId');

    if (itemId) {
      // Delete single item
      await prisma.cart.delete({
        where: { id: itemId },
      });
    } else if (userId) {
      // Clear entire cart for user
      await prisma.cart.deleteMany({
        where: { userId },
      });
    } else {
      return NextResponse.json(
        { error: 'Item ID or User ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Cart delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
