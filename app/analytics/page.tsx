'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import UserProfile from '@/components/auth/UserProfile';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Package, Target, ChefHat, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data - in a real app, this would come from your database
  const dailySalesData = [
    { date: 'Mon', sales: 12500, orders: 45, profit: 6200 },
    { date: 'Tue', sales: 15800, orders: 52, profit: 7800 },
    { date: 'Wed', sales: 11200, orders: 38, profit: 5600 },
    { date: 'Thu', sales: 18500, orders: 67, profit: 9200 },
    { date: 'Fri', sales: 22300, orders: 78, profit: 11100 },
    { date: 'Sat', sales: 28900, orders: 95, profit: 14400 },
    { date: 'Sun', sales: 25600, orders: 89, profit: 12800 }
  ];

  const platformData = [
    { name: 'Dine-in', value: 45, color: '#10B981' },
    { name: 'Zomato', value: 30, color: '#EF4444' },
    { name: 'Swiggy', value: 20, color: '#F59E0B' },
    { name: 'Online', value: 5, color: '#3B82F6' }
  ];

  const topItemsData = [
    { name: 'Chicken Biryani', sales: 145, revenue: 43355 },
    { name: 'Margherita Pizza', sales: 89, revenue: 35511 },
    { name: 'Paneer Butter Masala', sales: 76, revenue: 18924 },
    { name: 'Chocolate Brownie', sales: 67, revenue: 9983 },
    { name: 'Veg Fried Rice', sales: 54, revenue: 10800 }
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 285000, profit: 142500, orders: 890 },
    { month: 'Feb', revenue: 320000, profit: 160000, orders: 1020 },
    { month: 'Mar', revenue: 298000, profit: 149000, orders: 980 },
    { month: 'Apr', revenue: 345000, profit: 172500, orders: 1150 },
    { month: 'May', revenue: 398000, profit: 199000, orders: 1280 },
    { month: 'Jun', revenue: 425000, profit: 212500, orders: 1350 }
  ];

  const kpiData = {
    totalRevenue: 425000,
    totalOrders: 1350,
    avgOrderValue: 315,
    profitMargin: 50,
    topSellingItem: 'Chicken Biryani',
    bestPlatform: 'Dine-in',
    monthlyGrowth: 12.5,
    customerRetention: 68
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <AuthGuard allowedRoles={['owner', 'admin']}>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <ChefHat className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">RestaurantPro</h1>
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
              <Link href="/menu" className="text-gray-600 hover:text-gray-900 transition-colors">Menu</Link>
              <Link href="/sales" className="text-gray-600 hover:text-gray-900 transition-colors">Sales</Link>
              <Link href="/inventory" className="text-gray-600 hover:text-gray-900 transition-colors">Inventory</Link>
              <Link href="/analytics" className="text-blue-600 font-medium">Analytics</Link>
            </nav>
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600 mt-1">Comprehensive insights into your restaurant performance</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(kpiData.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{kpiData.monthlyGrowth}% from last month</span>
                  </div>
                </div>
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{kpiData.totalOrders.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600">+8.2% from last month</span>
                  </div>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(kpiData.avgOrderValue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 mr-1" />
                    <span className="text-sm text-purple-600">+5.4% from last month</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  <p className="text-3xl font-bold text-gray-900">{kpiData.profitMargin}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">Healthy margin</span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Daily Sales Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily Sales & Profit Trend</CardTitle>
              <CardDescription>Revenue and profit for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'sales' ? formatCurrency(Number(value)) : `₹${value}`,
                        name === 'sales' ? 'Sales' : 'Profit'
                      ]}
                    />
                    <Bar dataKey="sales" fill="#3B82F6" name="sales" />
                    <Bar dataKey="profit" fill="#10B981" name="profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Order distribution by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: platform.color }}
                      ></div>
                      <span>{platform.name}</span>
                    </div>
                    <span className="font-medium">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>6-month revenue and profit trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatCurrency(Number(value)), 
                        name === 'revenue' ? 'Revenue' : 'Profit'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Selling Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>Most popular dishes this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItemsData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.sales} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                      <p className="text-sm text-gray-600">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key insights and recommendations for your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">Strong Performance</h4>
                </div>
                <p className="text-sm text-green-700">
                  Your profit margin of 50% is excellent. Chicken Biryani continues to be your top performer with consistent high demand.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Opportunity</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Consider promoting online platforms more - they currently represent only 25% of orders but have lower operational costs.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center mb-2">
                  <Package className="w-5 h-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-orange-800">Action Needed</h4>
                </div>
                <p className="text-sm text-orange-700">
                  Weekend sales are 30% higher than weekdays. Consider optimizing staff scheduling and inventory for peak periods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </AuthGuard>
  );
}