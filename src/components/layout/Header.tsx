'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore, useUserStore } from '@/store';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories', children: [] },
  { name: 'Deals', href: '/deals' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tk', name: 'Türkmen', flag: '🇹🇲' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'TMT', symbol: 'm.', name: 'Turkmen Manat' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const { toggleCart, getItemCount } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();
  const { theme, setTheme, language, setLanguage, currency, setCurrency, toggleSearch, toggleMobileMenu } = useUIStore();
  const { user, isAuthenticated } = useUserStore();

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Phone className="w-3 h-3" />
                <span>+1 (234) 567-890</span>
              </a>
              <a href="mailto:support@example.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Mail className="w-3 h-3" />
                <span>support@example.com</span>
              </a>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/track-order" className="hover:text-primary-400 transition-colors">
                Track Order
              </Link>
              <Link href="/help" className="hover:text-primary-400 transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300',
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">
                E-Commerce
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  className="w-full h-12 pl-4 pr-12 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-primary transition-colors"
                  onFocus={() => toggleSearch()}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden md:flex w-10 h-10 rounded-full items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language Selector */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{languages.find(l => l.code === language)?.flag}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700 py-2"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setIsLangOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                            language === lang.code && 'bg-primary/10 text-primary'
                          )}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Selector */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm font-medium">{currencies.find(c => c.code === currency)?.symbol}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {isCurrencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700 py-2"
                    >
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setCurrency(curr.code as any);
                            setIsCurrencyOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                            currency === curr.code && 'bg-primary/10 text-primary'
                          )}
                        >
                          <span className="font-medium">{curr.symbol}</span>
                          <span>{curr.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block border-t dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-8 h-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium hover:text-primary transition-colors relative',
                    pathname === item.href && 'text-primary'
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  );
}

function MobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { user, isAuthenticated } = useUserStore();

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={toggleMobileMenu}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold">Menu</span>
                <button
                  onClick={toggleMobileMenu}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search - Mobile */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-12 pl-4 pr-12 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* User Info - Mobile */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation - Mobile */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Auth Links - Mobile */}
              <div className="mt-6 pt-6 border-t dark:border-gray-800">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/account"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 rounded-lg bg-primary text-white text-center font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 rounded-lg border-2 border-primary text-primary text-center font-medium"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
