'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Flame } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

function CountdownTimer({ endDate }: { endDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg">
        <span className="font-mono text-lg font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-xs">h</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg">
        <span className="font-mono text-lg font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-xs">m</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg">
        <span className="font-mono text-lg font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-xs">s</span>
      </div>
    </div>
  );
}

const dealProducts: Product[] = [
  {
    id: '5',
    name: '4K Ultra HD Smart TV 55"',
    slug: '4k-smart-tv-55',
    sku: 'TV-005',
    description: 'Stunning 4K display with smart features',
    price: 699.99,
    comparePrice: 999.99,
    quantity: 20,
    trackQuantity: true,
    lowStockThreshold: 5,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.7,
    reviewCount: 312,
  },
  {
    id: '6',
    name: 'Robot Vacuum Cleaner',
    slug: 'robot-vacuum-cleaner',
    sku: 'VC-006',
    description: 'Smart robot vacuum with auto-empty feature',
    price: 349.99,
    comparePrice: 499.99,
    quantity: 45,
    trackQuantity: true,
    lowStockThreshold: 10,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '4', name: 'Home', slug: 'home', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '5', name: 'iRobot', slug: 'irobot', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.4,
    reviewCount: 178,
  },
];

export function Deals() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Flash Deals</h2>
              <p className="text-gray-500 mt-1">Limited time offers</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <CountdownTimer endDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} />
            <Link
              href="/deals"
              className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            >
              View All Deals
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
