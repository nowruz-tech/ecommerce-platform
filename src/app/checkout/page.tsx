'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  Truck,
  Check,
  MapPin,
  Package,
  ChevronRight,
  Lock,
  Loader2,
} from 'lucide-react';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { orderSchema } from '@/lib/validators';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import type { z } from 'zod';

type OrderFormData = z.infer<typeof orderSchema>;

const steps = [
  { id: 1, name: 'Shipping', icon: Truck },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: Package },
];

const paymentMethods = [
  { id: 'credit-card', name: 'Credit Card', icon: CreditCard },
  { id: 'paypal', name: 'PayPal', icon: () => <span className="font-bold">P</span> },
  { id: 'apple-pay', name: 'Apple Pay', icon: () => <span className="font-bold">A</span> },
  { id: 'google-pay', name: 'Google Pay', icon: () => <span className="font-bold">G</span> },
  { id: 'cod', name: 'Cash on Delivery', icon: () => <span className="font-bold">$</span> },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax(0.15);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      toast.success('Order placed successfully!');
      // Redirect to order confirmation
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`hidden sm:block font-medium ${
                      currentStep >= step.id ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
                  >
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Shipping Address
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          {...register('shippingAddress.name')}
                          className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Enter full name"
                        />
                        {errors.shippingAddress?.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          {...register('shippingAddress.phone')}
                          className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Enter phone number"
                        />
                        {errors.shippingAddress?.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <select
                          {...register('shippingAddress.country')}
                          className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="">Select country</option>
                          <option value="US">United States</option>
                          <option value="TM">Turkmenistan</option>
                          <option value="TR">Turkey</option>
                          <option value="RU">Russia</option>
                        </select>
                        {errors.shippingAddress?.country && (
                          <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.country.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          {...register('shippingAddress.city')}
                          className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Enter city"
                        />
                        {errors.shippingAddress?.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.city.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Street Address</label>
                        <input
                          {...register('shippingAddress.street')}
                          className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Enter street address"
                        />
                        {errors.shippingAddress?.street && (
                          <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.street.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Building</label>
                        <input
                          {...register('shippingAddress.building')}
                          className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Building number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Apartment</label>
                        <input
                          {...register('shippingAddress.apartment')}
                          className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Apartment number"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                      >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
                  >
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Payment Method
                    </h2>

                    <div className="space-y-3 mb-6">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            selectedPayment === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="w-5 h-5 text-primary"
                          />
                          <method.icon className="w-6 h-6" />
                          <span className="font-medium">{method.name}</span>
                        </label>
                      ))}
                    </div>

                    {selectedPayment === 'credit-card' && (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                          <label className="block text-sm font-medium mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 rounded-xl border dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                      >
                        Review Order
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
                  >
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Review Order
                    </h2>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {formatCurrency(Number(item.product.price) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Any special instructions for your order?"
                      />
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 rounded-xl border dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-8 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            Place Order
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({items.length} items)</span>
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

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
