// User Types
export interface User {
  id: string;
  email: string;
  phone?: string | null;
  name?: string | null;
  avatar?: string | null;
  emailVerified?: Date | null;
  phoneVerified?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: Role | null;
  profile?: Profile | null;
}

export interface Profile {
  id: string;
  bio?: string | null;
  birthday?: Date | null;
  gender?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  action: string;
  resource: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  district?: string | null;
  street: string;
  building?: string | null;
  apartment?: string | null;
  zipCode?: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string | null;
  description: string;
  shortDescription?: string | null;
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;
  taxRate: number;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  allowBackorder: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  subcategory?: Subcategory | null;
  brand?: Brand | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  tags: ProductTag[];
  attributes: ProductAttribute[];
  averageRating?: number;
  reviewCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string | null;
  isActive: boolean;
  attributes: VariantAttribute[];
}

export interface VariantAttribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  isActive: boolean;
  sortOrder: number;
  parent?: Category | null;
  children?: Category[];
  subcategories?: Subcategory[];
  _count?: {
    products: number;
  };
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  category: Category;
  _count?: {
    products: number;
  };
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

// Cart Types
export interface CartItem {
  id: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
  variant?: ProductVariant | null;
  coupon?: Coupon | null;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  createdAt: Date;
  product: Product;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  notes?: string | null;
  shippingAddress?: any;
  billingAddress?: any;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  payments: Payment[];
  shipments: Shipment[];
  statusHistory: OrderStatusHistory[];
  invoice?: Invoice | null;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string | null;
  product?: Product | null;
  variant?: ProductVariant | null;
}

export interface OrderStatusHistory {
  id: string;
  status: string;
  note?: string | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  transactionId?: string | null;
  providerData?: any;
  createdAt: Date;
}

export interface Shipment {
  id: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  status?: string | null;
  estimatedDelivery?: Date | null;
  actualDelivery?: Date | null;
  notes?: string | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  issuedDate: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string | null;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumAmount?: number | null;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: Date;
  expiresAt: Date;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  position: string;
  isActive: boolean;
  sortOrder: number;
  startsAt?: Date | null;
  expiresAt?: Date | null;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  discountType: string;
  discountValue: number;
  minimumAmount?: number | null;
  isActive: boolean;
  startsAt: Date;
  expiresAt: Date;
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  image?: string | null;
  author?: string | null;
  status: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags: string[];
  views: number;
  isFeatured: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  status: string;
  createdAt: Date;
  user: User;
  replies?: Comment[];
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sortOrder: number;
  isActive: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  type: string;
  attachment?: string | null;
  isRead: boolean;
  createdAt: Date;
  sender: User;
  receiver: User;
}

// Ticket Types
export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
}

// Analytics Types
export interface Analytics {
  id: string;
  event: string;
  page: string;
  productId?: string | null;
  userId?: string | null;
  sessionId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  referrer?: string | null;
  metadata?: any;
  createdAt: Date;
}

// Dashboard Analytics Types
export interface DashboardAnalytics {
  dailySales: { date: string; amount: number }[];
  monthlySales: { month: string; amount: number }[];
  yearlySales: { year: string; amount: number }[];
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  topProducts: Product[];
  topPages: { page: string; views: number }[];
  onlineUsers: number;
  recentOrders: Order[];
}

// Settings Types
export interface Setting {
  id: string;
  key: string;
  value: any;
  group: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isActive: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states: string[];
  zipCodes: string[];
  isActive: boolean;
  methods: ShippingMethod[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  freeShipping: boolean;
  minimumAmount?: number | null;
  estimatedDays?: number | null;
  isActive: boolean;
}

// Enums
export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'ON_HOLD';

export type PaymentStatus = 
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'CANCELLED';

export type FulfillmentStatus = 
  | 'UNFULFILLED'
  | 'PARTIALLY_FULFILLED'
  | 'FULFILLED'
  | 'SHIPPED'
  | 'DELIVERED';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Language Types
export type Language = 'tk' | 'en' | 'ru' | 'tr';

// Currency Code Types
export type CurrencyCode = 'TMT' | 'USD' | 'EUR' | 'TRY' | 'RUB';
