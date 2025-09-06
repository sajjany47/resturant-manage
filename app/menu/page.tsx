"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import UserProfile from "@/components/auth/UserProfile";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChefHat,
  Package,
  IndianRupee,
  Calculator,
  Zap,
  Box,
  X,
} from "lucide-react";
import Link from "next/link";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DeleteMenuItem,
  MenuCreate,
  MenuList,
  MenuUpdate,
} from "../MainService";
import { toast } from "sonner";
import CustomLoader from "@/components/CustomLoader";
import { set } from "mongoose";

interface ExpenseItem {
  name: string;
  cost: number;
}

interface PlatformCommission {
  name: string;
  rate: number;
  color: string;
}

interface MenuFormValues {
  name: string;
  category: string;
  description: string;
  expenses: ExpenseItem[];
  desiredProfit: number;
  stock: number;
  minStock: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Item name is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  expenses: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Expense name is required"),
        cost: Yup.number()
          .min(0, "Cost must be positive")
          .required("Cost is required"),
      })
    )
    .min(1, "At least one expense item is required"),
  desiredProfit: Yup.number()
    .min(0, "Profit must be positive")
    .required("Desired profit is required"),
  stock: Yup.number()
    .min(0, "Stock must be positive")
    .required("Stock is required"),
  minStock: Yup.number()
    .min(0, "Min stock must be positive")
    .required("Min stock is required"),
});

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    fetchTicketList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddDialogOpen]);

  const fetchTicketList = () => {
    setLoading(true);
    MenuList()
      .then((res) => {
        setMenuItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  const platformCommissions: PlatformCommission[] = [
    { name: "Zomato", rate: 38, color: "bg-red-100 text-red-800" },
    { name: "Swiggy", rate: 38, color: "bg-orange-100 text-orange-800" },
    { name: "Offline", rate: 20, color: "bg-blue-100 text-blue-800" },
    { name: "Online", rate: 25, color: "bg-green-100 text-green-800" },
  ];

  const categories = [
    "all",
    "Starters",
    "Main Course",
    "Pizza",
    "Desserts",
    "Beverages",
    "Breads",
    "Momo",
  ];

  // Calculate platform prices based on total cost and desired profit
  const calculatePlatformPrices = (
    totalCost: number,
    desiredProfit: number
  ) => {
    const targetRevenue = totalCost + desiredProfit;

    const prices = {
      zomato: Math.ceil(targetRevenue / (1 - 0.38)), // 38% commission
      swiggy: Math.ceil(targetRevenue / (1 - 0.38)), // 38% commission
      offline: Math.ceil(targetRevenue / (1 - 0.2)), // 20% commission
      online: Math.ceil(targetRevenue / (1 - 0.25)), // 25% commission
    };

    return prices;
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (values: MenuFormValues, { resetForm }: any) => {
    setLoading(true);
    const totalCost = values.expenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );
    const prices = calculatePlatformPrices(totalCost, values.desiredProfit);

    const newItem: any = {
      name: values.name,
      category: values.category,
      description: values.description,
      expenses: values.expenses,
      totalCost,
      desiredProfit: values.desiredProfit,
      zomatoPrice: prices.zomato,
      swiggyPrice: prices.swiggy,
      offlinePrice: prices.offline,
      onlinePrice: prices.online,
      stock: values.stock,
      minStock: values.minStock,
      isAvailable: true,
    };

    if (editingItem) {
      MenuUpdate({ ...newItem, menuId: editingItem._id })
        .then((res) => {
          resetForm();
          setIsAddDialogOpen(false);
          setEditingItem(null);
          toast.success(res.message || "Menu item updated successfully 🎉");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message || "Failed to update menu item ❌");
        });
    } else {
      MenuCreate({ ...newItem })
        .then((res) => {
          resetForm();
          setIsAddDialogOpen(false);
          toast.success(res.message || "Menu item created successfully 🎉");
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to create menu item ❌");
          setLoading(false);
        });
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setLoading(true);
    DeleteMenuItem(id)
      .then((res) => {
        toast.success(res.message || "Menu item deleted successfully 🎉");
        fetchTicketList();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to delete menu item ❌");
      });
    setMenuItems(menuItems.filter((item) => item._id !== id));
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock)
      return { status: "Low Stock", color: "bg-red-100 text-red-800" };
    if (stock <= minStock * 1.5)
      return { status: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { status: "Good", color: "bg-green-100 text-green-800" };
  };

  const initialValues: MenuFormValues = editingItem
    ? {
        name: editingItem.name,
        category: editingItem.category,
        description: editingItem.description,
        expenses: editingItem.expenses,
        desiredProfit: editingItem.desiredProfit,
        stock: editingItem.stock,
        minStock: editingItem.minStock,
      }
    : {
        name: "",
        category: "",
        description: "",
        expenses: [
          { name: "Making Cost", cost: 0 },
          { name: "Electric", cost: 0 },
          { name: "Packaging", cost: 0 },
          { name: "Sauce", cost: 0 },
        ],
        desiredProfit: 0,
        stock: 0,
        minStock: 0,
      };

  return (
    <AuthGuard allowedRoles={["owner", "staff"]}>
      {loading && <CustomLoader />}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <ChefHat className="w-8 h-8 text-blue-600 mr-3" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    RestaurantPro
                  </h1>
                </Link>
              </div>
              <nav className="flex space-x-8">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/menu" className="text-blue-600 font-medium">
                  Menu
                </Link>
                <Link
                  href="/sales"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sales
                </Link>
                <Link
                  href="/inventory"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Inventory
                </Link>
                <Link
                  href="/analytics"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Analytics
                </Link>
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
              <h2 className="text-3xl font-bold text-gray-900">
                Menu Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage menu items with automatic platform pricing
              </p>
            </div>
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) setEditingItem(null);
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Update the details and costs of your menu item."
                      : "Add a new item with automatic platform pricing calculation."}
                  </DialogDescription>
                </DialogHeader>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, setFieldValue }) => {
                    const totalCost = values.expenses.reduce(
                      (sum, expense) => sum + expense.cost,
                      0
                    );
                    const calculatedPrices =
                      totalCost > 0 && values.desiredProfit > 0
                        ? calculatePlatformPrices(
                            totalCost,
                            values.desiredProfit
                          )
                        : null;

                    return (
                      <Form className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Item Name</Label>
                            <Field
                              as={Input}
                              id="name"
                              name="name"
                              placeholder="e.g., Chicken Momo"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-red-600 text-sm"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Field name="category">
                              {({ field }: any) => (
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    setFieldValue("category", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.slice(1).map((cat) => (
                                      <SelectItem key={cat} value={cat}>
                                        {cat}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </Field>
                            <ErrorMessage
                              name="category"
                              component="div"
                              className="text-red-600 text-sm"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Field
                              as={Textarea}
                              id="description"
                              name="description"
                              placeholder="Brief description of the item"
                            />
                            <ErrorMessage
                              name="description"
                              component="div"
                              className="text-red-600 text-sm"
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Expense Items */}
                        <div className="grid gap-4">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Calculator className="w-4 h-4 mr-2" />
                            Expense Breakdown
                          </h4>

                          <FieldArray name="expenses">
                            {({ push, remove }) => (
                              <div className="space-y-3">
                                {values.expenses.map((expense, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-3 items-start p-3 border rounded-lg bg-gray-50"
                                  >
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                      <div>
                                        <Label
                                          htmlFor={`expenses.${index}.name`}
                                        >
                                          Expense Name
                                        </Label>
                                        <Field
                                          as={Input}
                                          name={`expenses.${index}.name`}
                                          placeholder="e.g., Making Cost"
                                        />
                                        <ErrorMessage
                                          name={`expenses.${index}.name`}
                                          component="div"
                                          className="text-red-600 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`expenses.${index}.cost`}
                                        >
                                          Cost (₹)
                                        </Label>
                                        <Field
                                          as={Input}
                                          type="number"
                                          step="0.01"
                                          name={`expenses.${index}.cost`}
                                          placeholder="0"
                                        />
                                        <ErrorMessage
                                          name={`expenses.${index}.cost`}
                                          component="div"
                                          className="text-red-600 text-xs"
                                        />
                                      </div>
                                    </div>
                                    {values.expenses.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => remove(index)}
                                        className="text-red-600 hover:text-red-700 mt-6"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}

                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => push({ name: "", cost: 0 })}
                                  className="w-full"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Expense Item
                                </Button>

                                {totalCost > 0 && (
                                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-blue-900">
                                        Total Cost:
                                      </span>
                                      <span className="text-xl font-bold text-blue-900">
                                        ₹{totalCost}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </FieldArray>
                        </div>

                        <Separator />

                        {/* Desired Profit */}
                        <div className="grid gap-2">
                          <Label htmlFor="desiredProfit">
                            Desired Profit (₹)
                          </Label>
                          <Field
                            as={Input}
                            type="number"
                            step="0.01"
                            id="desiredProfit"
                            name="desiredProfit"
                            placeholder="30"
                          />
                          <ErrorMessage
                            name="desiredProfit"
                            component="div"
                            className="text-red-600 text-sm"
                          />
                        </div>

                        {/* Calculated Prices Preview */}
                        {calculatedPrices && (
                          <>
                            <Separator />
                            <div className="grid gap-4">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <IndianRupee className="w-4 h-4 mr-2" />
                                Calculated Platform Prices
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                  <p className="text-sm font-medium text-red-800">
                                    Zomato (38% commission)
                                  </p>
                                  <p className="text-xl font-bold text-red-900">
                                    ₹{calculatedPrices.zomato}
                                  </p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                  <p className="text-sm font-medium text-orange-800">
                                    Swiggy (38% commission)
                                  </p>
                                  <p className="text-xl font-bold text-orange-900">
                                    ₹{calculatedPrices.swiggy}
                                  </p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-sm font-medium text-blue-800">
                                    Offline (20% commission)
                                  </p>
                                  <p className="text-xl font-bold text-blue-900">
                                    ₹{calculatedPrices.offline}
                                  </p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm font-medium text-green-800">
                                    Online (25% commission)
                                  </p>
                                  <p className="text-xl font-bold text-green-900">
                                    ₹{calculatedPrices.online}
                                  </p>
                                </div>
                              </div>

                              {/* Cost Summary */}
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Cost Summary
                                </h5>
                                <div className="space-y-1 text-sm">
                                  {values.expenses.map((expense, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between"
                                    >
                                      <span>{expense.name}:</span>
                                      <span>₹{expense.cost}</span>
                                    </div>
                                  ))}
                                  <Separator />
                                  <div className="flex justify-between font-medium">
                                    <span>Total Cost:</span>
                                    <span>₹{totalCost}</span>
                                  </div>
                                  <div className="flex justify-between text-green-600 font-medium">
                                    <span>Desired Profit:</span>
                                    <span>₹{values.desiredProfit}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <Separator />

                        {/* Stock Information */}
                        <div className="grid gap-4">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Stock Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="stock">Stock Quantity</Label>
                              <Field
                                as={Input}
                                type="number"
                                id="stock"
                                name="stock"
                                placeholder="25"
                              />
                              <ErrorMessage
                                name="stock"
                                component="div"
                                className="text-red-600 text-sm"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="minStock">Min Stock Alert</Label>
                              <Field
                                as={Input}
                                type="number"
                                id="minStock"
                                name="minStock"
                                placeholder="10"
                              />
                              <ErrorMessage
                                name="minStock"
                                component="div"
                                className="text-red-600 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {editingItem ? "Update Item" : "Add Item"}
                          </Button>
                        </DialogFooter>
                      </Form>
                    );
                  }}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>

          {/* Platform Commission Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Platform Commission Rates
              </CardTitle>
              <CardDescription>
                Current commission rates for automatic price calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platformCommissions.map((platform) => (
                  <div
                    key={platform.name}
                    className="p-3 border rounded-lg text-center"
                  >
                    <Badge className={`${platform.color} mb-2`}>
                      {platform.name}
                    </Badge>
                    <p className="text-2xl font-bold text-gray-900">
                      {platform.rate}%
                    </p>
                    <p className="text-xs text-gray-600">Commission</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item.stock, item.minStock);

              return (
                <Card
                  key={item._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {item.category}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={item.isAvailable ? "default" : "secondary"}
                        className={
                          item.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{item.description}</p>

                    {/* Expense Breakdown */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Box className="w-4 h-4 mr-1" />
                        Expense Breakdown
                      </h5>
                      <div className="space-y-1 text-sm">
                        {item.expenses.map((expense: any, index: any) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">
                              {expense.name}:
                            </span>
                            <span>₹{expense.cost}</span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total Cost:</span>
                          <span>₹{item.totalCost}</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Target Profit:</span>
                          <span>₹{item.desiredProfit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Platform Prices */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-red-50 rounded text-center">
                        <p className="text-xs text-red-700">Zomato</p>
                        <p className="font-bold text-red-900">
                          ₹{item.zomatoPrice}
                        </p>
                      </div>
                      <div className="p-2 bg-orange-50 rounded text-center">
                        <p className="text-xs text-orange-700">Swiggy</p>
                        <p className="font-bold text-orange-900">
                          ₹{item.swiggyPrice}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded text-center">
                        <p className="text-xs text-blue-700">Offline</p>
                        <p className="font-bold text-blue-900">
                          ₹{item.offlinePrice}
                        </p>
                      </div>
                      <div className="p-2 bg-green-50 rounded text-center">
                        <p className="text-xs text-green-700">Online</p>
                        <p className="font-bold text-green-900">
                          ₹{item.onlinePrice}
                        </p>
                      </div>
                    </div>

                    {/* Stock and Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Stock: </span>
                        <span className="font-semibold">{item.stock}</span>
                        <Badge
                          className={`${stockStatus.color} border-0 text-xs`}
                        >
                          {stockStatus.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAvailability(item._id)}
                          className={
                            item.isAvailable
                              ? "text-red-600 hover:text-red-700"
                              : "text-green-600 hover:text-green-700"
                          }
                        >
                          {item.isAvailable ? "Hide" : "Show"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No menu items found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
