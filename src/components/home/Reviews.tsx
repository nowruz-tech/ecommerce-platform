'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'John Smith',
    avatar: '/images/avatar-1.jpg',
    rating: 5,
    title: 'Excellent Quality!',
    comment: 'Amazing products and fast delivery. The quality exceeded my expectations. Will definitely shop again!',
    product: 'Wireless Headphones',
    date: '2 days ago',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    avatar: '/images/avatar-2.jpg',
    rating: 5,
    title: 'Best Online Shopping Experience',
    comment: 'The website is easy to navigate and checkout was seamless. Customer service was very helpful.',
    product: 'Smart Watch',
    date: '1 week ago',
  },
  {
    id: 3,
    name: 'Michael Brown',
    avatar: '/images/avatar-3.jpg',
    rating: 4,
    title: 'Great Value for Money',
    comment: 'Good quality products at competitive prices. Shipping was a bit slow but overall satisfied.',
    product: 'Running Shoes',
    date: '2 weeks ago',
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: '/images/avatar-4.jpg',
    rating: 5,
    title: 'Highly Recommended!',
    comment: 'This is my go-to store now. The product range is excellent and returns are hassle-free.',
    product: 'Designer Handbag',
    date: '3 weeks ago',
  },
];

export function Reviews() {
  const [current, setCurrent] = useState(0);

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">What Our Customers Say</h2>
          <p className="text-gray-500 mt-1">Real reviews from real customers</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${current * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex"
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm text-center">
                    <Quote className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{review.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{review.comment}</p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-lg font-bold">{review.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{review.name}</p>
                        <p className="text-sm text-gray-500">Purchased: {review.product}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === current ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
