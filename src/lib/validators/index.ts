import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Profile schemas
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  birthday: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Phone number is required'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  district: z.string().optional(),
  street: z.string().min(5, 'Street address is required'),
  building: z.string().optional(),
  apartment: z.string().optional(),
  zipCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// Product schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  sku: z.string().min(2, 'SKU is required'),
  barcode: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().max(500).optional(),
  price: z.number().min(0, 'Price must be positive'),
  comparePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).default(0),
  trackQuantity: z.boolean().default(true),
  quantity: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  allowBackorder: z.boolean().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  brandId: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

// Order schemas
export const orderSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(10, 'Phone number is required'),
    country: z.string().min(2, 'Country is required'),
    city: z.string().min(2, 'City is required'),
    district: z.string().optional(),
    street: z.string().min(5, 'Street address is required'),
    building: z.string().optional(),
    apartment: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  shippingMethod: z.string().min(1, 'Shipping method is required'),
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
});

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().min(1).default(1),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  inStock: z.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular', 'rating']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Review schemas
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(2, 'Title is required').max(100),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
});

// Blog schemas
export const blogSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  content: z.string().min(10, 'Content is required'),
  excerpt: z.string().max(500).optional(),
  image: z.string().url().optional(),
  author: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

// FAQ schemas
export const faqSchema = z.object({
  question: z.string().min(5, 'Question is required'),
  answer: z.string().min(10, 'Answer is required'),
  category: z.string().optional(),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Coupon schemas
export const couponSchema = z.object({
  code: z.string().min(3, 'Code is required').max(20),
  description: z.string().max(500).optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().min(0, 'Discount value must be positive'),
  minimumAmount: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().transform((v) => new Date(v)),
  expiresAt: z.string().transform((v) => new Date(v)),
});

// Banner schemas
export const bannerSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().max(200).optional(),
  image: z.string().url('Image URL is required'),
  link: z.string().url().optional(),
  position: z.string().min(1, 'Position is required'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
  startsAt: z.string().optional().transform((v) => v ? new Date(v) : undefined),
  expiresAt: z.string().optional().transform((v) => v ? new Date(v) : undefined),
});
