'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

const stats = [
  {
    title: 'Total Revenue',
    value: '$54,239',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  {
    title: 'Products',
    value: '456',
    change: '+3.1%',
    trend: 'up',
    icon: Package,
    color: 'bg-purple-500',
  },
  {
    title: 'Customers',
    value: '789',
    change: '-2.4%',
    trend: 'down',
    icon: Users,
    color: 'bg-orange-500',
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Smith', total: 299.99, status: 'delivered', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Sarah Johnson', total: 149.50, status: 'processing', date: '2024-01-14' },
  { id: 'ORD-003', customer: 'Michael Brown', total: 89.99, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Emily Davis', total: 549.00, status: 'shipped', date: '2024-01-13' },
  { id: 'ORD-005', customer: 'James Wilson', total: 199.99, status: 'delivered', date: '2024-01-12' },
];

const topProducts = [
  { name: 'Wireless Headphones', sold: 156, revenue: 46782 },
  { name: 'Smart Watch Pro', sold: 98, revenue: 44099 },
  { name: 'Running Shoes', sold: 234, revenue: 44386 },
  { name: 'Designer Handbag', sold: 45, revenue: 26999 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Sales Overview</h3>
            <select className="px-3 py-1 rounded-lg border dark:border-gray-700 text-sm bg-transparent">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 80, 50].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t-lg relative"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg"
                    style={{ height: '60%' }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Top Products</h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sold} sold</p>
                </div>
                <p className="font-bold">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <div className="p-6 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Recent Orders</h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-800">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b dark:border-gray-800 last:border-0">
                  <td className="p-4 font-medium">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4 font-bold">{formatCurrency(order.total)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                  <td className="p-4">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
