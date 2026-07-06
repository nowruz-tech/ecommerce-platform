import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter conditions
    const where: any = {
      isActive: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build order by condition
    let orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'popular':
        orderBy = { reviews: { _count: 'desc' } };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const avgRating = product.reviews.length
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0;
      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      };
    });

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      price,
      comparePrice,
      categoryId,
      brandId,
      quantity,
    } = body;

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description,
        price,
        comparePrice,
        categoryId,
        brandId,
        quantity,
        shortDescription: body.shortDescription,
        costPrice: body.costPrice,
        taxRate: body.taxRate || 0,
        trackQuantity: body.trackQuantity !== false,
        lowStockThreshold: body.lowStockThreshold || 5,
        weight: body.weight,
        length: body.length,
        width: body.width,
        height: body.height,
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured || false,
        isDigital: body.isDigital || false,
        allowBackorder: body.allowBackorder || false,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
