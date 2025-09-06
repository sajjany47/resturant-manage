import AuthGuard from '@/components/auth/AuthGuard';
import UserProfile from '@/components/auth/UserProfile';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChefHat, TrendingUp, Package, IndianRupee, Users, ShoppingCart } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      title: "Today's Sales",
      value: "₹12,450",
      change: "+12.5%",
      icon: IndianRupee,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: "89",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Menu Items",
      value: "156",
      change: "+3 new",
      icon: ChefHat,
      color: "text-purple-600"
    },
    {
      title: "Low Stock Items",
      value: "7",
      change: "Need attention",
      icon: Package,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Menu Management",
      description: "Add, edit, and manage your menu items, pricing, and costs",
      href: "/menu",
      icon: ChefHat,
      color: "bg-blue-500"
    },
    {
      title: "Daily Sales",
      description: "Track orders, sales, and platform commissions",
      href: "/sales",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      title: "Stock Management",
      description: "Monitor inventory levels and stock alerts",
      href: "/inventory", 
      icon: Package,
      color: "bg-orange-500"
    },
    {
      title: "Profit Analytics",
      description: "Analyze profitability and financial performance",
      href: "/analytics",
      icon: IndianRupee,
      color: "bg-purple-500"
    }
  ];

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">RestaurantPro</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/menu" className="text-gray-600 hover:text-gray-900 transition-colors">Menu</Link>
              <Link href="/sales" className="text-gray-600 hover:text-gray-900 transition-colors">Sales</Link>
              <Link href="/inventory" className="text-gray-600 hover:text-gray-900 transition-colors">Inventory</Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">Analytics</Link>
            </nav>
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your restaurant today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.color} mt-1`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <Link href={action.href}>
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        Get Started <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New order received</p>
                  <p className="text-xs text-gray-600">Order #1234 - ₹750 via Zomato</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                  <p className="text-xs text-gray-600">Chicken Biryani - Only 5 portions left</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Menu item updated</p>
                  <p className="text-xs text-gray-600">Margherita Pizza price updated to ₹399</p>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </AuthGuard>
  );
}