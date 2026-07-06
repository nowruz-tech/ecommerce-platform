# E-Commerce Platform

Dünýä derejesindäki professional internet magazin (E-Commerce) web platformasy.

## Technologiyalar

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google, Facebook, Apple, Credentials)
- **State Management**: Zustand
- **Animation**: Framer Motion
- **API**: REST API
- **Testing**: Jest, React Testing Library
- **Deployment**: Docker, Nginx

## Esasy Modullar

### Ulanyjy Ulgamy
- ✅ Agza bolmak (Register)
- ✅ Login (Email/Password)
- ✅ Google, Facebook, Apple Login
- ✅ Email Verification
- ✅ Password Reset
- ✅ Profile Management
- ✅ Address Management

### Önüm Ulgamy
- ✅ Product Listing
- ✅ Product Details
- ✅ Product Images & Zoom
- ✅ Variants (Color, Size)
- ✅ Ratings & Reviews
- ✅ Related Products
- ✅ Quick View

### Gözleg
- ✅ Instant Search
- ✅ Category Filter
- ✅ Brand Filter
- ✅ Price Filter
- ✅ Rating Filter
- ✅ Sort Options
- ✅ Pagination

### Sebet (Cart)
- ✅ Add to Cart
- ✅ Update Quantity
- ✅ Remove Item
- ✅ Coupon Code
- ✅ Tax Calculation
- ✅ Shipping Calculation

### Checkout
- ✅ One Page Checkout
- ✅ Address Form
- ✅ Payment Method Selection
- ✅ Order Summary
- ✅ Order Confirmation

### Sargyt Ulgamy
- ✅ Order History
- ✅ Order Tracking
- ✅ Order Status Updates
- ✅ Invoice Generation

### Töleg Ulgamy
- ✅ Credit Card (Stripe)
- ✅ PayPal
- ✅ Apple Pay
- ✅ Google Pay
- ✅ Cash on Delivery

### Admin Panel
- ✅ Dashboard with Analytics
- ✅ Products Management
- ✅ Orders Management
- ✅ Customers Management
- ✅ Categories & Brands
- ✅ Coupons & Campaigns
- ✅ Blog Management
- ✅ Settings

### UI/UX
- ✅ Responsive Design
- ✅ Dark/Light Mode
- ✅ Smooth Animations
- ✅ Glassmorphism Effects
- ✅ Loading Skeletons
- ✅ Toast Notifications

### SEO & Performance
- ✅ Meta Tags
- ✅ Open Graph
- ✅ Sitemap
- ✅ robots.txt
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Lazy Loading
- ✅ PWA Support

### Howpsuzlyk
- ✅ JWT Authentication
- ✅ HTTPS/SSL
- ✅ CSRF Protection
- ✅ XSS Protection
- ✅ SQL Injection Protection
- ✅ Rate Limiting
- ✅ Input Validation

## Satşyň

```bash
# Git clone
git clone https://github.com/yourusername/ecommerce-platform.git

# Directory ga geçin
cd ecommerce-platform

# Baglanyşyklary sazlaň
cp .env.example .env
# .env faýlynda zatlarý dolduryň

# NPM install
npm install

# Database migrations
npx prisma migrate dev

# Development server
npm run dev

# Production build
npm run build
npm start
```

## Docker Bilen Satşyň

```bash
# Docker compose
docker-compose up -d

# Production
docker build -t ecommerce .
docker run -p 3000:3000 ecommerce
```

## Folder Structure

```
ecommerce-platform/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── icons/
│   ├── images/
│   └── locales/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── products/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── product/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── store/
│   ├── styles/
│   └── types/
├── docker/
│   └── nginx.conf
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order status

### Admin
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id` - Update order

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""

# Payment
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="E-Commerce Platform"
```

## License

MIT License
