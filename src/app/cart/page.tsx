'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Tag, Truck } from 'lucide-react';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTax, getTotal, getItemCount } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const tax = getTax(0.15);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;
  const itemCount = getItemCount();

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Coupon applied successfully!');
    setIsApplyingCoupon(false);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart ({itemCount})</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1">{item.product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.product.category.name}</p>
                            {item.variant && (
                              <p className="text-sm text-gray-500">Variant: {item.variant.name}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-lg border dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {formatCurrency((Number(item.variant?.price || item.product.price)) * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                {formatCurrency(Number(item.variant?.price || item.product.price))} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode}
                    className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (15%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {shipping > 0 && (
                <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
                    <Truck className="w-4 h-4" />
                    <span>Add {formatCurrency(50 - subtotal)} more for free shipping!</span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-3 rounded-xl bg-primary text-white font-medium text-center block hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </Link>

              {/* Secure Checkout */}
              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
