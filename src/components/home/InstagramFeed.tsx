'use client';

import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

const posts = [
  { id: 1, image: '/images/insta-1.jpg', likes: 234, comments: 12 },
  { id: 2, image: '/images/insta-2.jpg', likes: 189, comments: 8 },
  { id: 3, image: '/images/insta-3.jpg', likes: 312, comments: 24 },
  { id: 4, image: '/images/insta-4.jpg', likes: 156, comments: 6 },
  { id: 5, image: '/images/insta-5.jpg', likes: 278, comments: 15 },
  { id: 6, image: '/images/insta-6.jpg', likes: 201, comments: 10 },
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
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export function InstagramFeed() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Instagram className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-medium text-gray-500">@ecommerce_store</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Follow Us on Instagram</h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Heart className="w-5 h-5 fill-current" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
