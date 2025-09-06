'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import UserProfile from '@/components/auth/UserProfile';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, CalendarIcon, ShoppingCart, TrendingUp, IndianRupee, Truck, ChefHat, DollarSign, Minus, X } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
  itemCost: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  platform: 'Dine-in' | 'Zomato' | 'Swiggy' | 'Online';
  commission: number;
  commissionRate: number;
  netAmount: number;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
  totalMakingCost: number;
  profit: number;
}

export default function SalesPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: '1', name: 'Chicken Biryani', price: 299, cost: 180, category: 'Main Course' },
    { id: '2', name: 'Margherita Pizza', price: 399, cost: 220, category: 'Pizza' },
    { id: '3', name: 'Paneer Butter Masala', price: 249, cost: 120, category: 'Main Course' },
    { id: '4', name: 'Chocolate Brownie', price: 149, cost: 60, category: 'Desserts' },
    { id: '5', name: 'Veg Fried Rice', price: 199, cost: 80, category: 'Main Course' },
    { id: '6', name: 'Chicken Tikka', price: 279, cost: 150, category: 'Starters' },
    { id: '7', name: 'Masala Chai', price: 49, cost: 15, category: 'Beverages' },
    { id: '8', name: 'Garlic Naan', price: 79, cost: 25, category: 'Breads' }
  ];

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      items: [
        {
          menuItem: menuItems[0],
          quantity: 2,
          subtotal: 598,
          itemCost: 360
        },
        {
          menuItem: menuItems[2],
          quantity: 1,
          subtotal: 249,
          itemCost: 120
        }
      ],
      subtotal: 847,
      discount: 50,
      total: 797,
      platform: 'Zomato',
      commissionRate: 20,
      commission: 159.4,
      netAmount: 637.6,
      date: new Date(),
      status: 'completed',
      totalMakingCost: 480,
      profit: 157.6
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      items: [
        {
          menuItem: menuItems[1],
          quantity: 1,
          subtotal: 399,
          itemCost: 220
        }
      ],
      subtotal: 399,
      discount: 0,
      total: 399,
      platform: 'Dine-in',
      commissionRate: 0,
      commission: 0,
      netAmount: 399,
      date: new Date(),
      status: 'completed',
      totalMakingCost: 220,
      profit: 179
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    platform: '',
    selectedItems: [] as OrderItem[],
    discount: 0
  });

  const platformCommissionRates = {
    'Dine-in': 0,
    'Zomato': 20,
    'Swiggy': 20,
    'Online': 5
  };

  // Calculate order totals
  const calculateOrderTotals = (items: OrderItem[], discount: number, platform: string) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal - discount;
    const commissionRate = platformCommissionRates[platform as keyof typeof platformCommissionRates] || 0;
    const commission = (total * commissionRate) / 100;
    const netAmount = total - commission;
    const totalMakingCost = items.reduce((sum, item) => sum + item.itemCost, 0);
    const profit = netAmount - totalMakingCost;

    return {
      subtotal,
      total,
      commission,
      commissionRate,
      netAmount,
      totalMakingCost,
      profit
    };
  };

  const addMenuItem = (menuItem: MenuItem) => {
    const existingItemIndex = newOrder.selectedItems.findIndex(
      item => item.menuItem.id === menuItem.id
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...newOrder.selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * menuItem.price;
      updatedItems[existingItemIndex].itemCost = updatedItems[existingItemIndex].quantity * menuItem.cost;
      setNewOrder({ ...newOrder, selectedItems: updatedItems });
    } else {
      const newItem: OrderItem = {
        menuItem,
        quantity: 1,
        subtotal: menuItem.price,
        itemCost: menuItem.cost
      };
      setNewOrder({ ...newOrder, selectedItems: [...newOrder.selectedItems, newItem] });
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeMenuItem(itemId);
      return;
    }

    const updatedItems = newOrder.selectedItems.map(item => {
      if (item.menuItem.id === itemId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.menuItem.price,
          itemCost: quantity * item.menuItem.cost
        };
      }
      return item;
    });
    setNewOrder({ ...newOrder, selectedItems: updatedItems });
  };

  const removeMenuItem = (itemId: string) => {
    const updatedItems = newOrder.selectedItems.filter(item => item.menuItem.id !== itemId);
    setNewOrder({ ...newOrder, selectedItems: updatedItems });
  };

  const handleAddOrder = () => {
    if (!newOrder.platform || newOrder.selectedItems.length === 0) return;

    const calculations = calculateOrderTotals(newOrder.selectedItems, newOrder.discount, newOrder.platform);
    
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      items: newOrder.selectedItems,
      subtotal: calculations.subtotal,
      discount: newOrder.discount,
      total: calculations.total,
      platform: newOrder.platform as any,
      commission: calculations.commission,
      commissionRate: calculations.commissionRate,
      netAmount: calculations.netAmount,
      date: new Date(),
      status: 'completed',
      totalMakingCost: calculations.totalMakingCost,
      profit: calculations.profit
    };

    setOrders([order, ...orders]);
    setNewOrder({
      platform: '',
      selectedItems: [],
      discount: 0
    });
    setIsAddOrderOpen(false);
  };

  // Filter orders by selected date
  const todaysOrders = orders.filter(order => 
    order.date.toDateString() === selectedDate.toDateString()
  );

  // Calculate daily stats
  const dailyStats = {
    totalOrders: todaysOrders.length,
    totalSales: todaysOrders.reduce((sum, order) => sum + order.total, 0),
    totalCommission: todaysOrders.reduce((sum, order) => sum + order.commission, 0),
    netRevenue: todaysOrders.reduce((sum, order) => sum + order.netAmount, 0),
    totalCost: todaysOrders.reduce((sum, order) => sum + order.totalMakingCost, 0),
    profit: todaysOrders.reduce((sum, order) => sum + order.profit, 0)
  };

  // Platform breakdown
  const platformStats = todaysOrders.reduce((acc, order) => {
    if (!acc[order.platform]) {
      acc[order.platform] = { orders: 0, revenue: 0, commission: 0, profit: 0 };
    }
    acc[order.platform].orders += 1;
    acc[order.platform].revenue += order.total;
    acc[order.platform].commission += order.commission;
    acc[order.platform].profit += order.profit;
    return acc;
  }, {} as Record<string, { orders: number; revenue: number; commission: number; profit: number }>);

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'Zomato': return 'bg-red-100 text-red-800';
      case 'Swiggy': return 'bg-orange-100 text-orange-800';
      case 'Online': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  // Calculate current order totals for preview
  const currentOrderCalculations = newOrder.platform ? 
    calculateOrderTotals(newOrder.selectedItems, newOrder.discount, newOrder.platform) : 
    { subtotal: 0, total: 0, commission: 0, commissionRate: 0, netAmount: 0, totalMakingCost: 0, profit: 0 };

  return (
    <AuthGuard allowedRoles={['owner', 'staff']}>
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
              <Link href="/sales" className="text-blue-600 font-medium">Sales</Link>
              <Link href="/inventory" className="text-gray-600 hover:text-gray-900 transition-colors">Inventory</Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">Analytics</Link>
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
            <h2 className="text-3xl font-bold text-gray-900">Daily Sales</h2>
            <p className="text-gray-600 mt-1">Track orders, revenue, and platform commissions</p>
          </div>
          <div className="flex gap-4 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Order</DialogTitle>
                  <DialogDescription>
                    Select platform, menu items, and calculate commissions automatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Platform Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={newOrder.platform} onValueChange={(value) => setNewOrder({...newOrder, platform: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dine-in">Dine-in (0% commission)</SelectItem>
                        <SelectItem value="Zomato">Zomato (20% commission)</SelectItem>
                        <SelectItem value="Swiggy">Swiggy (20% commission)</SelectItem>
                        <SelectItem value="Online">Online (5% commission)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Menu Items Selection */}
                  <div className="grid gap-4">
                    <Label>Menu Items</Label>
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="grid gap-2">
                        {menuItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">{item.category}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">₹{item.price}</p>
                                  <p className="text-xs text-gray-500">Cost: ₹{item.cost}</p>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addMenuItem(item)}
                              className="ml-3"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Selected Items */}
                  {newOrder.selectedItems.length > 0 && (
                    <div className="grid gap-4">
                      <Label>Selected Items</Label>
                      <div className="border rounded-lg p-4 space-y-3">
                        {newOrder.selectedItems.map((item) => (
                          <div key={item.menuItem.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{item.menuItem.name}</p>
                              <p className="text-sm text-gray-600">₹{item.menuItem.price} each • Cost: ₹{item.menuItem.cost}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateItemQuantity(item.menuItem.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateItemQuantity(item.menuItem.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <p className="font-semibold">₹{item.subtotal}</p>
                                <p className="text-xs text-gray-500">Cost: ₹{item.itemCost}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMenuItem(item.menuItem.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discount */}
                  <div className="grid gap-2">
                    <Label htmlFor="discount">Discount Amount (₹)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      value={newOrder.discount}
                      onChange={(e) => setNewOrder({...newOrder, discount: parseFloat(e.target.value) || 0})}
                      placeholder="Enter discount amount"
                    />
                  </div>

                  {/* Order Summary */}
                  {newOrder.selectedItems.length > 0 && newOrder.platform && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-gray-900">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{currentOrderCalculations.subtotal.toFixed(2)}</span>
                        </div>
                        {newOrder.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-₹{newOrder.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>₹{currentOrderCalculations.total.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-red-600">
                          <span>Platform Commission ({currentOrderCalculations.commissionRate}%):</span>
                          <span>-₹{currentOrderCalculations.commission.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                          <span>Net Revenue:</span>
                          <span>₹{currentOrderCalculations.netAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                          <span>Making Cost:</span>
                          <span>₹{currentOrderCalculations.totalMakingCost.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Profit:</span>
                          <span className={currentOrderCalculations.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ₹{currentOrderCalculations.profit.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleAddOrder}
                    disabled={!newOrder.platform || newOrder.selectedItems.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Order
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{dailyStats.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">₹{dailyStats.totalSales.toFixed(0)}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commission</p>
                  <p className="text-2xl font-bold text-red-600">₹{dailyStats.totalCommission.toFixed(0)}</p>
                </div>
                <Truck className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">₹{dailyStats.netRevenue.toFixed(0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Making Cost</p>
                  <p className="text-2xl font-bold text-orange-600">₹{dailyStats.totalCost.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className={dailyStats.profit >= 0 ? "border-green-200" : "border-red-200"}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit</p>
                  <p className={`text-2xl font-bold ${dailyStats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{dailyStats.profit.toFixed(0)}
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${dailyStats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Platform Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
              <CardDescription>Orders and revenue by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(platformStats).map(([platform, stats]) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getPlatformBadgeColor(platform)}>
                        {platform}
                      </Badge>
                      <span className="text-sm font-medium">{stats.orders} orders</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{stats.revenue.toFixed(0)}</p>
                      <p className="text-xs text-green-600">+₹{stats.profit.toFixed(0)} profit</p>
                      {stats.commission > 0 && (
                        <p className="text-xs text-red-600">-₹{stats.commission.toFixed(0)} commission</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Orders</CardTitle>
              <CardDescription>Detailed order information for {format(selectedDate, 'MMMM d, yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">#{order.orderNumber}</h4>
                        <p className="text-sm text-gray-600">{format(order.date, 'h:mm a')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getPlatformBadgeColor(order.platform)}>
                          {order.platform}
                        </Badge>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.menuItem.name} x{item.quantity}</span>
                          <div className="text-right">
                            <span className="font-medium">₹{item.subtotal.toFixed(0)}</span>
                            <span className="text-xs text-gray-500 ml-2">(Cost: ₹{item.itemCost.toFixed(0)})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">₹{order.subtotal.toFixed(0)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{order.discount.toFixed(0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-semibold">₹{order.total.toFixed(0)}</span>
                      </div>
                      {order.commission > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Commission ({order.commissionRate}%):</span>
                          <span>-₹{order.commission.toFixed(0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Net Revenue:</span>
                        <span className="font-semibold text-blue-600">₹{order.netAmount.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-orange-600">
                        <span>Making Cost:</span>
                        <span>₹{order.totalMakingCost.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                        <span>Profit:</span>
                        <span className={`${order.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{order.profit.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {todaysOrders.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders for this date</h3>
                    <p className="text-gray-600">Orders will appear here when they are recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}