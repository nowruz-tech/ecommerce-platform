'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Tag,
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { useUIStore } from '@/store';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    children: [
      { name: 'All Orders', href: '/admin/orders' },
      { name: 'Pending', href: '/admin/orders?status=pending' },
      { name: 'Processing', href: '/admin/orders?status=processing' },
      { name: 'Shipped', href: '/admin/orders?status=shipped' },
      { name: 'Delivered', href: '/admin/orders?status=delivered' },
    ],
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add New', href: '/admin/products/new' },
      { name: 'Categories', href: '/admin/categories' },
      { name: 'Brands', href: '/admin/brands' },
    ],
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    name: 'Marketing',
    href: '/admin/marketing',
    icon: Tag,
    children: [
      { name: 'Coupons', href: '/admin/coupons' },
      { name: 'Banners', href: '/admin/banners' },
      { name: 'Campaigns', href: '/admin/campaigns' },
    ],
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    children: [
      { name: 'Blog', href: '/admin/blog' },
      { name: 'FAQ', href: '/admin/faq' },
      { name: 'Pages', href: '/admin/pages' },
    ],
  },
  {
    name: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    name: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b dark:border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-gray-500">E-Commerce Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.includes(item.name) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.name) && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-4"
                      >
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              className={`block px-4 py-2 rounded-lg text-sm ${
                                pathname === child.href
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-bold text-primary">A</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
          <button className="text-gray-400 hover:text-red-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 lg:hidden"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
