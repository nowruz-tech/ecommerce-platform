'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl border dark:border-gray-700 font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
