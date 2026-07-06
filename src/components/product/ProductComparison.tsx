'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Star, Check, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/store';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
}

export function ProductComparison({ products, onRemove }: ProductComparisonProps) {
  const { addItem } = useCartStore();
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const attributes = [
    { key: 'price', label: 'Price', format: (v: number) => formatCurrency(v) },
    { key: 'comparePrice', label: 'Original Price', format: (v: number) => formatCurrency(v) },
    { key: 'rating', label: 'Rating', format: (v: number) => `${v} / 5` },
    { key: 'reviews', label: 'Reviews', format: (v: number) => `${v} reviews` },
    { key: 'brand', label: 'Brand', format: (v: string) => v },
    { key: 'category', label: 'Category', format: (v: string) => v },
    { key: 'sku', label: 'SKU', format: (v: string) => v },
    { key: 'stock', label: 'Stock', format: (v: number) => v > 0 ? `In Stock (${v})` : 'Out of Stock' },
    { key: 'weight', label: 'Weight', format: (v: number) => `${v} kg` },
    { key: 'warranty', label: 'Warranty', format: (v: string) => v || 'N/A' },
    { key: 'returnPolicy', label: 'Return Policy', format: (v: string) => v || '30 Days' },
  ];

  const getAttributeValue = (product: Product, key: string) => {
    switch (key) {
      case 'price':
        return Number(product.price);
      case 'comparePrice':
        return product.comparePrice ? Number(product.comparePrice) : null;
      case 'rating':
        return product.averageRating || 0;
      case 'reviews':
        return product.reviewCount || 0;
      case 'brand':
        return product.brand?.name || 'N/A';
      case 'category':
        return product.category?.name || 'N/A';
      case 'sku':
        return product.sku;
      case 'stock':
        return product.quantity;
      case 'weight':
        return product.weight || null;
      case 'warranty':
        return (product.attributes.find(a => a.name === 'warranty')?.value) || null;
      case 'returnPolicy':
        return (product.attributes.find(a => a.name === 'returnPolicy')?.value) || null;
      default:
        return null;
    }
  };

  const isDifferent = (key: string) => {
    if (products.length < 2) return false;
    const values = products.map(p => getAttributeValue(p, key));
    return new Set(values).size > 1;
  };

  const getBestValue = (key: string) => {
    if (products.length < 2) return null;
    const values = products.map(p => getAttributeValue(p, key));
    
    if (key === 'price' || key === 'comparePrice') {
      return Math.min(...values.filter(v => v !== null));
    }
    if (key === 'rating' || key === 'reviews' || key === 'stock') {
      return Math.max(...values.filter(v => v !== null));
    }
    return null;
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Compare Products ({products.length})</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm">Highlight differences</span>
          </label>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Product Headers */}
          <thead>
            <tr className="border-b dark:border-gray-800">
              <th className="p-4 text-left w-40">Product</th>
              {products.map((product) => (
                <th key={product.id} className="p-4 text-center min-w-[200px]">
                  <div className="relative">
                    <button
                      onClick={() => onRemove(product.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-24 h-24 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="font-medium line-clamp-2 mb-2">{product.name}</h3>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}
              {products.length < 4 && (
                <th className="p-4 text-center min-w-[200px]">
                  <Link
                    href="/products"
                    className="w-full py-24 rounded-xl border-2 border-dashed dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary hover:border-primary transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span>Add Product</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>

          {/* Attributes */}
          <tbody>
            {attributes.map((attr, index) => (
              <tr
                key={attr.key}
                className={cn(
                  'border-b dark:border-gray-800',
                  highlightDifferences && isDifferent(attr.key) && 'bg-primary/5'
                )}
              >
                <td className="p-4 font-medium text-gray-500">{attr.label}</td>
                {products.map((product) => {
                  const value = getAttributeValue(product, attr.key);
                  const bestValue = getBestValue(attr.key);
                  const isBest = bestValue !== null && value === bestValue;
                  
                  return (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {attr.format(value) !== 'N/A' ? (
                          <span className={cn(
                            'font-medium',
                            highlightDifferences && isDifferent(attr.key) && 'text-primary',
                            isBest && 'text-green-600 dark:text-green-400'
                          )}>
                            {attr.format(value)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        {isBest && <Check className="w-4 h-4 text-green-600 dark:text-green-400" />}
                      </div>
                    </td>
                  );
                })}
                {products.length < 4 && <td className="p-4">-</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Compare Button Component
interface CompareButtonProps {
  product: Product;
  isComparing: boolean;
  onToggle: () => void;
}

export function CompareButton({ product, isComparing, onToggle }: CompareButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        isComparing
          ? 'bg-primary text-white'
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
      )}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      {isComparing ? 'Comparing' : 'Compare'}
    </button>
  );
}
