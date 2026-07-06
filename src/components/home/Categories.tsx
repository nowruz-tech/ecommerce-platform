'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', image: '/images/cat-electronics.jpg', count: 1250 },
  { id: 2, name: 'Fashion', slug: 'fashion', image: '/images/cat-fashion.jpg', count: 3420 },
  { id: 3, name: 'Home & Garden', slug: 'home-garden', image: '/images/cat-home.jpg', count: 890 },
  { id: 4, name: 'Sports', slug: 'sports', image: '/images/cat-sports.jpg', count: 567 },
  { id: 5, name: 'Beauty', slug: 'beauty', image: '/images/cat-beauty.jpg', count: 2340 },
  { id: 6, name: 'Toys', slug: 'toys', image: '/images/cat-toys.jpg', count: 1120 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Categories() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Browse Categories</h2>
            <p className="text-gray-500 mt-1">Find what you're looking for</p>
          </div>
          <Link
            href="/categories"
            className="text-primary font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.count} products</p>
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
