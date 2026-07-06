'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      toast.success('Thanks for subscribing!');
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-white/80">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-5 h-5" />
                    Subscribed
                  </>
                ) : (
                  'Subscribe'
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
