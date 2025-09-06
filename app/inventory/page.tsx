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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Search, Filter, Package, AlertTriangle, TrendingUp, ChefHat, Scale, Calculator } from 'lucide-react';
import Link from 'next/link';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string; // kg, liters, pieces, etc.
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier: string;
  lastUpdated: Date;
}

interface Recipe {
  ingredientId: string;
  quantity: number; // quantity needed per dish
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  recipe: Recipe[]; // ingredients needed
  preparationTime: number; // in minutes
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: '1',
      name: 'Mozzarella Cheese',
      category: 'Dairy',
      currentStock: 5.5,
      unit: 'kg',
      minStock: 2,
      maxStock: 10,
      costPerUnit: 450,
      supplier: 'Fresh Dairy Co.',
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Chicken Breast',
      category: 'Meat',
      currentStock: 8.2,
      unit: 'kg',
      minStock: 3,
      maxStock: 15,
      costPerUnit: 280,
      supplier: 'Premium Meats',
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'Basmati Rice',
      category: 'Grains',
      currentStock: 25,
      unit: 'kg',
      minStock: 10,
      maxStock: 50,
      costPerUnit: 120,
      supplier: 'Quality Grains Ltd',
      lastUpdated: new Date()
    },
    {
      id: '4',
      name: 'Tomatoes',
      category: 'Vegetables',
      currentStock: 12,
      unit: 'kg',
      minStock: 5,
      maxStock: 20,
      costPerUnit: 60,
      supplier: 'Fresh Farm Produce',
      lastUpdated: new Date()
    },
    {
      id: '5',
      name: 'Pizza Dough',
      category: 'Prepared',
      currentStock: 15,
      unit: 'pieces',
      minStock: 8,
      maxStock: 30,
      costPerUnit: 25,
      supplier: 'Bakery Express',
      lastUpdated: new Date()
    },
    {
      id: '6',
      name: 'Paneer',
      category: 'Dairy',
      currentStock: 3.5,
      unit: 'kg',
      minStock: 2,
      maxStock: 8,
      costPerUnit: 320,
      supplier: 'Fresh Dairy Co.',
      lastUpdated: new Date()
    }
  ]);

  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      category: 'Pizza',
      sellingPrice: 399,
      preparationTime: 15,
      recipe: [
        { ingredientId: '5', quantity: 1 }, // 1 pizza dough
        { ingredientId: '1', quantity: 0.15 }, // 150g cheese
        { ingredientId: '4', quantity: 0.1 } // 100g tomatoes
      ]
    },
    {
      id: '2',
      name: 'Chicken Biryani',
      category: 'Main Course',
      sellingPrice: 299,
      preparationTime: 45,
      recipe: [
        { ingredientId: '3', quantity: 0.2 }, // 200g rice
        { ingredientId: '2', quantity: 0.15 }, // 150g chicken
        { ingredientId: '4', quantity: 0.05 } // 50g tomatoes
      ]
    },
    {
      id: '3',
      name: 'Paneer Butter Masala',
      category: 'Main Course',
      sellingPrice: 249,
      preparationTime: 25,
      recipe: [
        { ingredientId: '6', quantity: 0.2 }, // 200g paneer
        { ingredientId: '4', quantity: 0.1 }, // 100g tomatoes
        { ingredientId: '1', quantity: 0.05 } // 50g cheese for richness
      ]
    }
  ]);

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: '',
    currentStock: '',
    unit: '',
    minStock: '',
    maxStock: '',
    costPerUnit: '',
    supplier: ''
  });

  const categories = ['all', 'Dairy', 'Meat', 'Vegetables', 'Grains', 'Spices', 'Prepared', 'Beverages'];
  const units = ['kg', 'liters', 'pieces', 'grams', 'ml'];

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (current: number, min: number, max: number) => {
    if (current <= min) return { status: 'Critical', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    if (current <= min * 1.5) return { status: 'Low', color: 'bg-yellow-100 text-yellow-800', icon: Package };
    if (current >= max * 0.9) return { status: 'Overstocked', color: 'bg-blue-100 text-blue-800', icon: TrendingUp };
    return { status: 'Good', color: 'bg-green-100 text-green-800', icon: Package };
  };

  const calculatePossibleDishes = (menuItem: MenuItem) => {
    let maxPossible = Infinity;
    
    for (const recipeItem of menuItem.recipe) {
      const ingredient = ingredients.find(ing => ing.id === recipeItem.ingredientId);
      if (ingredient) {
        const possibleFromThisIngredient = Math.floor(ingredient.currentStock / recipeItem.quantity);
        maxPossible = Math.min(maxPossible, possibleFromThisIngredient);
      }
    }
    
    return maxPossible === Infinity ? 0 : maxPossible;
  };

  const calculateMakingCost = (menuItem: MenuItem) => {
    return menuItem.recipe.reduce((total, recipeItem) => {
      const ingredient = ingredients.find(ing => ing.id === recipeItem.ingredientId);
      if (ingredient) {
        return total + (ingredient.costPerUnit * recipeItem.quantity);
      }
      return total;
    }, 0);
  };

  const handleAddIngredient = () => {
    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: newIngredient.name,
      category: newIngredient.category,
      currentStock: parseFloat(newIngredient.currentStock),
      unit: newIngredient.unit,
      minStock: parseFloat(newIngredient.minStock),
      maxStock: parseFloat(newIngredient.maxStock),
      costPerUnit: parseFloat(newIngredient.costPerUnit),
      supplier: newIngredient.supplier,
      lastUpdated: new Date()
    };
    setIngredients([...ingredients, ingredient]);
    setNewIngredient({
      name: '',
      category: '',
      currentStock: '',
      unit: '',
      minStock: '',
      maxStock: '',
      costPerUnit: '',
      supplier: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setNewIngredient({
      name: ingredient.name,
      category: ingredient.category,
      currentStock: ingredient.currentStock.toString(),
      unit: ingredient.unit,
      minStock: ingredient.minStock.toString(),
      maxStock: ingredient.maxStock.toString(),
      costPerUnit: ingredient.costPerUnit.toString(),
      supplier: ingredient.supplier
    });
  };

  const handleUpdateIngredient = () => {
    if (!editingIngredient) return;
    
    const updatedIngredients = ingredients.map(ingredient => 
      ingredient.id === editingIngredient.id 
        ? {
            ...ingredient,
            name: newIngredient.name,
            category: newIngredient.category,
            currentStock: parseFloat(newIngredient.currentStock),
            unit: newIngredient.unit,
            minStock: parseFloat(newIngredient.minStock),
            maxStock: parseFloat(newIngredient.maxStock),
            costPerUnit: parseFloat(newIngredient.costPerUnit),
            supplier: newIngredient.supplier,
            lastUpdated: new Date()
          }
        : ingredient
    );
    setIngredients(updatedIngredients);
    setEditingIngredient(null);
    setNewIngredient({
      name: '',
      category: '',
      currentStock: '',
      unit: '',
      minStock: '',
      maxStock: '',
      costPerUnit: '',
      supplier: ''
    });
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const updateStock = (id: string, newStock: number) => {
    setIngredients(ingredients.map(ingredient => 
      ingredient.id === id 
        ? { ...ingredient, currentStock: newStock, lastUpdated: new Date() }
        : ingredient
    ));
  };

  // Calculate total inventory value
  const totalInventoryValue = ingredients.reduce((total, ingredient) => 
    total + (ingredient.currentStock * ingredient.costPerUnit), 0
  );

  // Count critical stock items
  const criticalStockItems = ingredients.filter(ingredient => 
    ingredient.currentStock <= ingredient.minStock
  ).length;

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
              <Link href="/sales" className="text-gray-600 hover:text-gray-900 transition-colors">Sales</Link>
              <Link href="/inventory" className="text-blue-600 font-medium">Inventory</Link>
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
            <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
            <p className="text-gray-600 mt-1">Track ingredients, stock levels, and recipe calculations</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
                <DialogDescription>
                  {editingIngredient ? 'Update ingredient details and stock information.' : 'Add a new ingredient to your inventory.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ingredient Name</Label>
                  <Input
                    id="name"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                    placeholder="e.g., Mozzarella Cheese"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newIngredient.category} onValueChange={(value) => setNewIngredient({...newIngredient, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={newIngredient.unit} onValueChange={(value) => setNewIngredient({...newIngredient, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      step="0.1"
                      value={newIngredient.currentStock}
                      onChange={(e) => setNewIngredient({...newIngredient, currentStock: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      step="0.1"
                      value={newIngredient.minStock}
                      onChange={(e) => setNewIngredient({...newIngredient, minStock: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxStock">Max Stock</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      step="0.1"
                      value={newIngredient.maxStock}
                      onChange={(e) => setNewIngredient({...newIngredient, maxStock: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="costPerUnit">Cost per Unit (₹)</Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.01"
                    value={newIngredient.costPerUnit}
                    onChange={(e) => setNewIngredient({...newIngredient, costPerUnit: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newIngredient.supplier}
                    onChange={(e) => setNewIngredient({...newIngredient, supplier: e.target.value})}
                    placeholder="Supplier name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={editingIngredient ? handleUpdateIngredient : handleAddIngredient}
                  disabled={!newIngredient.name || !newIngredient.category || !newIngredient.currentStock}
                >
                  {editingIngredient ? 'Update Ingredient' : 'Add Ingredient'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Ingredients</p>
                  <p className="text-3xl font-bold text-gray-900">{ingredients.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-3xl font-bold text-gray-900">₹{totalInventoryValue.toFixed(0)}</p>
                </div>
                <Scale className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                  <p className="text-3xl font-bold text-red-600">{criticalStockItems}</p>
                  <p className="text-sm text-red-600">Need attention</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
                <Filter className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingredient Inventory</CardTitle>
                <CardDescription>Current stock levels and ingredient details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredIngredients.map((ingredient) => {
                    const stockStatus = getStockStatus(ingredient.currentStock, ingredient.minStock, ingredient.maxStock);
                    const StatusIcon = stockStatus.icon;
                    
                    return (
                      <div key={ingredient.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{ingredient.name}</h4>
                            <p className="text-sm text-gray-600">{ingredient.category} • {ingredient.supplier}</p>
                          </div>
                          <Badge className={`${stockStatus.color} border-0`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {stockStatus.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Current Stock</p>
                            <p className="font-semibold">{ingredient.currentStock} {ingredient.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Min Stock</p>
                            <p className="font-semibold">{ingredient.minStock} {ingredient.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Cost per {ingredient.unit}</p>
                            <p className="font-semibold">₹{ingredient.costPerUnit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Value</p>
                            <p className="font-semibold text-green-600">₹{(ingredient.currentStock * ingredient.costPerUnit).toFixed(0)}</p>
                          </div>
                        </div>

                        {/* Stock Update */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1">
                            <Label htmlFor={`stock-${ingredient.id}`} className="text-xs">Update Stock</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                id={`stock-${ingredient.id}`}
                                type="number"
                                step="0.1"
                                value={ingredient.currentStock}
                                onChange={(e) => updateStock(ingredient.id, parseFloat(e.target.value) || 0)}
                                className="h-8"
                              />
                              <span className="text-sm text-gray-500 flex items-center">{ingredient.unit}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            Last updated: {ingredient.lastUpdated.toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditIngredient(ingredient)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteIngredient(ingredient.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recipe Calculator */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recipe Calculator</CardTitle>
                <CardDescription>See how many dishes you can make with current stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems.map((menuItem) => {
                    const possibleDishes = calculatePossibleDishes(menuItem);
                    const makingCost = calculateMakingCost(menuItem);
                    const profitPerDish = menuItem.sellingPrice - makingCost;
                    const totalPotentialProfit = possibleDishes * profitPerDish;
                    
                    return (
                      <div key={menuItem.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{menuItem.name}</h4>
                            <p className="text-sm text-gray-600">{menuItem.category}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMenuItem(menuItem)}
                          >
                            <Calculator className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Can Make:</span>
                            <span className={`font-bold ${possibleDishes > 10 ? 'text-green-600' : possibleDishes > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {possibleDishes} dishes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Making Cost:</span>
                            <span className="font-semibold">₹{makingCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Selling Price:</span>
                            <span className="font-semibold">₹{menuItem.sellingPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profit per Dish:</span>
                            <span className="font-semibold text-green-600">₹{profitPerDish.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Potential:</span>
                            <span className="font-bold text-green-600">₹{totalPotentialProfit.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Critical Stock Alerts */}
            {criticalStockItems > 0 && (
              <Card className="mt-6 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800">Stock Alerts</CardTitle>
                  <CardDescription>Items that need immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ingredients
                      .filter(ingredient => ingredient.currentStock <= ingredient.minStock)
                      .map((ingredient) => (
                        <Alert key={ingredient.id} className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            <strong>{ingredient.name}</strong> is running low: {ingredient.currentStock} {ingredient.unit} remaining
                          </AlertDescription>
                        </Alert>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recipe Details Dialog */}
        {selectedMenuItem && (
          <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedMenuItem.name} - Recipe Details</DialogTitle>
                <DialogDescription>
                  Detailed breakdown of ingredients and calculations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Selling Price</p>
                    <p className="text-xl font-bold">₹{selectedMenuItem.sellingPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preparation Time</p>
                    <p className="text-xl font-bold">{selectedMenuItem.preparationTime} min</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recipe Ingredients</h4>
                  <div className="space-y-3">
                    {selectedMenuItem.recipe.map((recipeItem, index) => {
                      const ingredient = ingredients.find(ing => ing.id === recipeItem.ingredientId);
                      if (!ingredient) return null;
                      
                      const cost = ingredient.costPerUnit * recipeItem.quantity;
                      const availablePortions = Math.floor(ingredient.currentStock / recipeItem.quantity);
                      
                      return (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{ingredient.name}</p>
                            <p className="text-sm text-gray-600">
                              {recipeItem.quantity} {ingredient.unit} per dish
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{cost.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">
                              Can make: {availablePortions} dishes
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Cost Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Making Cost:</span>
                      <span className="font-semibold">₹{calculateMakingCost(selectedMenuItem).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Selling Price:</span>
                      <span className="font-semibold">₹{selectedMenuItem.sellingPrice}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span>Profit per Dish:</span>
                      <span className="font-bold text-green-600">
                        ₹{(selectedMenuItem.sellingPrice - calculateMakingCost(selectedMenuItem)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit Margin:</span>
                      <span className="font-bold text-green-600">
                        {(((selectedMenuItem.sellingPrice - calculateMakingCost(selectedMenuItem)) / selectedMenuItem.sellingPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsRecipeDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Ingredient Dialog */}
        {editingIngredient && (
          <Dialog open={!!editingIngredient} onOpenChange={() => setEditingIngredient(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>
                <DialogDescription>
                  Update ingredient details and stock information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Ingredient Name</Label>
                  <Input
                    id="edit-name"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select value={newIngredient.category} onValueChange={(value) => setNewIngredient({...newIngredient, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-unit">Unit</Label>
                    <Select value={newIngredient.unit} onValueChange={(value) => setNewIngredient({...newIngredient, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-currentStock">Current Stock</Label>
                    <Input
                      id="edit-currentStock"
                      type="number"
                      step="0.1"
                      value={newIngredient.currentStock}
                      onChange={(e) => setNewIngredient({...newIngredient, currentStock: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-minStock">Min Stock</Label>
                    <Input
                      id="edit-minStock"
                      type="number"
                      step="0.1"
                      value={newIngredient.minStock}
                      onChange={(e) => setNewIngredient({...newIngredient, minStock: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-maxStock">Max Stock</Label>
                    <Input
                      id="edit-maxStock"
                      type="number"
                      step="0.1"
                      value={newIngredient.maxStock}
                      onChange={(e) => setNewIngredient({...newIngredient, maxStock: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-costPerUnit">Cost per Unit (₹)</Label>
                  <Input
                    id="edit-costPerUnit"
                    type="number"
                    step="0.01"
                    value={newIngredient.costPerUnit}
                    onChange={(e) => setNewIngredient({...newIngredient, costPerUnit: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Input
                    id="edit-supplier"
                    value={newIngredient.supplier}
                    onChange={(e) => setNewIngredient({...newIngredient, supplier: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateIngredient}>
                  Update Ingredient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
    </AuthGuard>
  );
}