import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  sku: 'TEST-001',
  description: 'Test product description',
  price: 99.99,
  comparePrice: 149.99,
  quantity: 10,
  trackQuantity: true,
  lowStockThreshold: 5,
  taxRate: 15,
  isActive: true,
  isFeatured: true,
  isDigital: false,
  allowBackorder: false,
  category: {
    id: '1',
    name: 'Test Category',
    slug: 'test-category',
    isActive: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  brand: {
    id: '1',
    name: 'Test Brand',
    slug: 'test-brand',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  images: [],
  variants: [],
  reviews: [],
  tags: [],
  attributes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  averageRating: 4.5,
  reviewCount: 10,
};

describe('ProductCard', () => {
  it('renders product name correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('displays price correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows compare price when available', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('$149.99')).toBeInTheDocument();
  });

  it('displays discount percentage', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('-33%')).toBeInTheDocument();
  });

  it('shows stock status', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('shows out of stock when quantity is 0', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('displays rating correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('calls addToCart when button is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('Utility Functions', () => {
  it('formats currency correctly', () => {
    // Test currency formatting
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    
    expect(formatCurrency(99.99)).toBe('$99.99');
    expect(formatCurrency(1000)).toBe('$1000.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('calculates discount correctly', () => {
    const calculateDiscount = (original: number, sale: number) => {
      return Math.round(((original - sale) / original) * 100);
    };
    
    expect(calculateDiscount(100, 80)).toBe(20);
    expect(calculateDiscount(200, 150)).toBe(25);
    expect(calculateDiscount(50, 25)).toBe(50);
  });

  it('generates slug correctly', () => {
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };
    
    expect(generateSlug('Hello World')).toBe('hello-world');
    expect(generateSlug('Test Product!')).toBe('test-product');
    expect(generateSlug('  Spaced  Text  ')).toBe('spaced-text');
  });
});
