'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product360ViewProps {
  images: string[];
  productName: string;
}

export function Product360View({ images, productName }: Product360ViewProps) {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  const totalImages = images.length;
  const anglePerImage = 360 / totalImages;

  useEffect(() => {
    if (isAutoRotating) {
      autoRotateRef.current = setInterval(() => {
        setCurrentAngle((prev) => (prev + anglePerImage) % 360);
      }, 100);
    } else if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isAutoRotating, anglePerImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const newAngle = (currentAngle + deltaX * 0.5) % 360;
    setCurrentAngle(newAngle < 0 ? newAngle + 360 : newAngle);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoRotating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const newAngle = (currentAngle + deltaX * 0.5) % 360;
    setCurrentAngle(newAngle < 0 ? newAngle + 360 : newAngle);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getCurrentImageIndex = () => {
    return Math.floor(currentAngle / anglePerImage) % totalImages;
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const handleReset = () => {
    setZoom(1);
    setCurrentAngle(0);
  };

  return (
    <div className="relative">
      {/* Main View */}
      <div
        ref={containerRef}
        className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 360 Image */}
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="relative w-full h-full">
            {/* Placeholder for 360 view */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <RotateCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">360° View</p>
                <p className="text-sm text-gray-400 mt-2">
                  Drag to rotate • Scroll to zoom
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Angle Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
          {Math.round(currentAngle)}°
        </div>

        {/* Drag Hint */}
        {!isDragging && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-1/2 left-4 -translate-y-1/2"
          >
            <div className="flex items-center gap-1 text-gray-500">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Drag</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isAutoRotating
              ? 'bg-primary text-white'
              : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700'
          }`}
        >
          <RotateCw className={`w-5 h-5 ${isAutoRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex justify-center gap-2 mt-4">
        {images.slice(0, 8).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentAngle(index * anglePerImage)}
            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
              getCurrentImageIndex() === index
                ? 'border-primary'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
              {index + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
