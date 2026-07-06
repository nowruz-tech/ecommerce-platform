'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Summer Collection 2024',
    subtitle: 'Up to 50% Off',
    description: 'Discover our latest summer styles with amazing discounts.',
    image: '/images/hero-1.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=summer',
    color: 'from-blue-600 to-purple-600',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Just Dropped',
    description: 'Be the first to shop our newest products.',
    image: '/images/hero-2.jpg',
    buttonText: 'Explore',
    buttonLink: '/products?sort=newest',
    color: 'from-pink-600 to-orange-600',
  },
  {
    id: 3,
    title: 'Flash Sale',
    subtitle: 'Limited Time Only',
    description: 'Hurry up! Deals end in 24 hours.',
    image: '/images/hero-3.jpg',
    buttonText: 'Shop Sale',
    buttonLink: '/deals',
    color: 'from-green-600 to-teal-600',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].color} opacity-80`} />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-2xl text-white"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                  {slides[current].subtitle}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {slides[current].title}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/90">
                  {slides[current].description}
                </p>
                <Link
                  href={slides[current].buttonLink}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
                >
                  {slides[current].buttonText}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
