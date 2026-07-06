'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '@/store';
import { formatCurrency, calculateDiscount, cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { openQuickView } = useUIStore();

  const isWishlisted = isInWishlist(product.id);
  const discount = product.comparePrice
    ? calculateDiscount(Number(product.comparePrice), Number(product.price))
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium">
                  -{discount}%
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
                )}
              >
                <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
              </button>
              <button
                onClick={handleQuickView}
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Add to Cart */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Placeholder Image */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.category.name}
              </span>
              {product.brand && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {product.brand.name}
                  </span>
                </>
              )}
            </div>

            {/* Name */}
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-4 h-4',
                      star <= (product.averageRating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                {formatCurrency(Number(product.price))}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(Number(product.comparePrice))}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.trackQuantity && (
              <div className="mt-2">
                {product.quantity > 0 ? (
                  <span className="text-xs text-green-600 dark:text-green-400">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Out of Stock
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
