'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    sku: 'WH-001',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    comparePrice: 399.99,
    quantity: 50,
    trackQuantity: true,
    lowStockThreshold: 5,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '1', name: 'Sony', slug: 'sony', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.5,
    reviewCount: 128,
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    sku: 'SW-002',
    description: 'Advanced smartwatch with health tracking',
    price: 449.99,
    comparePrice: 549.99,
    quantity: 30,
    trackQuantity: true,
    lowStockThreshold: 5,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '2', name: 'Apple', slug: 'apple', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.8,
    reviewCount: 256,
  },
  {
    id: '3',
    name: 'Running Shoes Elite',
    slug: 'running-shoes-elite',
    sku: 'RS-003',
    description: 'Professional running shoes for athletes',
    price: 189.99,
    comparePrice: 249.99,
    quantity: 100,
    trackQuantity: true,
    lowStockThreshold: 10,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '2', name: 'Sports', slug: 'sports', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '3', name: 'Nike', slug: 'nike', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.6,
    reviewCount: 89,
  },
  {
    id: '4',
    name: 'Designer Handbag',
    slug: 'designer-handbag',
    sku: 'HB-004',
    description: 'Luxury designer handbag made from premium materials',
    price: 599.99,
    comparePrice: 799.99,
    quantity: 15,
    trackQuantity: true,
    lowStockThreshold: 3,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '3', name: 'Fashion', slug: 'fashion', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '4', name: 'Gucci', slug: 'gucci', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.9,
    reviewCount: 45,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-500 mt-1">Handpicked just for you</p>
          </div>
          <Link
            href="/products?featured=true"
            className="text-primary font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
