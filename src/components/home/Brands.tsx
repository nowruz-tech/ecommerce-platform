'use client';

import { motion } from 'framer-motion';

const brands = [
  { id: 1, name: 'Apple', logo: '/images/brand-apple.svg' },
  { id: 2, name: 'Samsung', logo: '/images/brand-samsung.svg' },
  { id: 3, name: 'Nike', logo: '/images/brand-nike.svg' },
  { id: 4, name: 'Adidas', logo: '/images/brand-adidas.svg' },
  { id: 5, name: 'Sony', logo: '/images/brand-sony.svg' },
  { id: 6, name: 'LG', logo: '/images/brand-lg.svg' },
  { id: 7, name: 'Bosch', logo: '/images/brand-bosch.svg' },
  { id: 8, name: 'Philips', logo: '/images/brand-philips.svg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export function Brands() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Top Brands</h2>
          <p className="text-gray-500 mt-1">Shop from your favorite brands</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg flex items-center justify-center p-4 transition-shadow cursor-pointer"
            >
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-lg font-bold">{brand.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
