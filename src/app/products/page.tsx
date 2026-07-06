'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid, List, ChevronDown, X } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Product, SearchFilters } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    sku: 'WH-001',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    comparePrice: 399.99,
    quantity: 50,
    trackQuantity: true,
    lowStockThreshold: 5,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '1', name: 'Sony', slug: 'sony', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.5,
    reviewCount: 128,
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    sku: 'SW-002',
    description: 'Advanced smartwatch with health tracking',
    price: 449.99,
    comparePrice: 549.99,
    quantity: 30,
    trackQuantity: true,
    lowStockThreshold: 5,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '2', name: 'Apple', slug: 'apple', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.8,
    reviewCount: 256,
  },
  {
    id: '3',
    name: 'Running Shoes Elite',
    slug: 'running-shoes-elite',
    sku: 'RS-003',
    description: 'Professional running shoes for athletes',
    price: 189.99,
    comparePrice: 249.99,
    quantity: 100,
    trackQuantity: true,
    lowStockThreshold: 10,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '2', name: 'Sports', slug: 'sports', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '3', name: 'Nike', slug: 'nike', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.6,
    reviewCount: 89,
  },
  {
    id: '4',
    name: 'Designer Handbag',
    slug: 'designer-handbag',
    sku: 'HB-004',
    description: 'Luxury designer handbag made from premium materials',
    price: 599.99,
    comparePrice: 799.99,
    quantity: 15,
    trackQuantity: true,
    lowStockThreshold: 3,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '3', name: 'Fashion', slug: 'fashion', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '4', name: 'Gucci', slug: 'gucci', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.9,
    reviewCount: 45,
  },
  {
    id: '5',
    name: '4K Ultra HD Smart TV 55"',
    slug: '4k-smart-tv-55',
    sku: 'TV-005',
    description: 'Stunning 4K display with smart features',
    price: 699.99,
    comparePrice: 999.99,
    quantity: 20,
    trackQuantity: true,
    lowStockThreshold: 5,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.7,
    reviewCount: 312,
  },
  {
    id: '6',
    name: 'Robot Vacuum Cleaner',
    slug: 'robot-vacuum-cleaner',
    sku: 'VC-006',
    description: 'Smart robot vacuum with auto-empty feature',
    price: 349.99,
    comparePrice: 499.99,
    quantity: 45,
    trackQuantity: true,
    lowStockThreshold: 10,
    taxRate: 15,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    allowBackorder: false,
    category: { id: '4', name: 'Home', slug: 'home', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    brand: { id: '5', name: 'iRobot', slug: 'irobot', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    images: [],
    variants: [],
    reviews: [],
    tags: [],
    attributes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.4,
    reviewCount: 178,
  },
];

const categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', count: 1250 },
  { id: '2', name: 'Fashion', slug: 'fashion', count: 3420 },
  { id: '3', name: 'Home & Garden', slug: 'home-garden', count: 890 },
  { id: '4', name: 'Sports', slug: 'sports', count: 567 },
  { id: '5', name: 'Beauty', slug: 'beauty', count: 2340 },
  { id: '6', name: 'Toys', slug: 'toys', count: 1120 },
];

const brands = [
  { id: '1', name: 'Sony', slug: 'sony' },
  { id: '2', name: 'Apple', slug: 'apple' },
  { id: '3', name: 'Nike', slug: 'nike' },
  { id: '4', name: 'Gucci', slug: 'gucci' },
  { id: '5', name: 'iRobot', slug: 'irobot' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('query') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: Number(searchParams.get('minPrice')) || undefined,
    maxPrice: Number(searchParams.get('maxPrice')) || undefined,
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      sort: 'newest',
      page: 1,
    });
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {filters.category ? categories.find(c => c.slug === filters.category)?.name : 'All Products'}
            </h1>
            <p className="text-gray-500 mt-1">
              Showing {mockProducts.length} products
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`w-64 flex-shrink-0 ${
              isFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-3">Search</h3>
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.slug}
                        onChange={() => handleFilterChange('category', category.slug)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="flex-1">{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || undefined)}
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || undefined)}
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-semibold mb-3">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brand === brand.slug}
                        onChange={() => handleFilterChange('brand', filters.brand === brand.slug ? '' : brand.slug)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full py-2 text-primary font-medium hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {(filters.category || filters.brand || filters.query) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {filters.query && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Search: {filters.query}
                    <button onClick={() => handleFilterChange('query', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Category: {categories.find(c => c.slug === filters.category)?.name}
                    <button onClick={() => handleFilterChange('category', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    Brand: {brands.find(b => b.slug === filters.brand)?.name}
                    <button onClick={() => handleFilterChange('brand', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                : 'space-y-4'
            }>
              {mockProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
                disabled={filters.page === 1}
                className="px-4 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => handleFilterChange('page', page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    filters.page === page
                      ? 'bg-primary text-white'
                      : 'border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                disabled={filters.page === 5}
                className="px-4 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
