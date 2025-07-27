import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useWhatsApp } from "@/lib/whatsapp";
import {
  Plus,
  Package,
  TrendingUp,
  ShoppingBag,
  Bell,
  User,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Phone,
} from "lucide-react";

// Mock vendor data for WhatsApp integration
const mockVendors = [
  {
    id: "V001",
    name: "Rajesh's Chaat Corner",
    phone: "+91 98765 43210",
    location: "CP, Delhi",
  },
  {
    id: "V002",
    name: "Sharma Snacks",
    phone: "+91 87654 32109",
    location: "Karol Bagh, Delhi",
  },
  {
    id: "V003",
    name: "Mumbai Street Food",
    phone: "+91 76543 21098",
    location: "Bandra, Mumbai",
  },
];

// Mock data
const inventory = [
  {
    id: 1,
    name: "Premium Mustard Oil",
    category: "Oils & Fats",
    price: 180,
    stock: 50,
    unit: "liter",
    status: "active",
    orders: 24,
    revenue: 4320,
  },
  {
    id: 2,
    name: "Garam Masala Powder",
    category: "Spices",
    price: 320,
    stock: 25,
    unit: "kg",
    status: "active",
    orders: 18,
    revenue: 5760,
  },
  {
    id: 3,
    name: "Basmati Rice",
    category: "Grains",
    price: 120,
    stock: 0,
    unit: "kg",
    status: "out-of-stock",
    orders: 12,
    revenue: 1440,
  },
];

const recentOrders = [
  {
    id: "ORD001",
    vendor: "Rajesh's Chaat Corner",
    vendorPhone: "+91 98765 43210",
    vendorLocation: "CP, Delhi",
    items: "Mustard Oil (2L), Garam Masala (1kg)",
    amount: 680,
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORD002",
    vendor: "Sharma Snacks",
    vendorPhone: "+91 87654 32109",
    vendorLocation: "Karol Bagh, Delhi",
    items: "Basmati Rice (5kg)",
    amount: 600,
    status: "confirmed",
    date: "2024-01-15",
  },
  {
    id: "ORD003",
    vendor: "Mumbai Street Food",
    vendorPhone: "+91 76543 21098",
    vendorLocation: "Bandra, Mumbai",
    items: "Garam Masala (2kg), Mustard Oil (1L)",
    amount: 820,
    status: "delivered",
    date: "2024-01-14",
  },
];

export default function SupplierDashboard() {
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const { chatWithSupplier } = useWhatsApp();
  const [profileImage, setProfileImage] = useState<string>("");

  // Load saved profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "out-of-stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleOrderAction = (orderId: string, action: "accept" | "reject") => {
    console.log(`${action} order ${orderId}`);

    if (action === "accept") {
      addNotification({
        title: "Order Accepted",
        message: `Order ${orderId} has been accepted and vendor will be notified`,
        type: "success",
        icon: "✅",
      });
    } else {
      addNotification({
        title: "Order Rejected",
        message: `Order ${orderId} has been rejected`,
        type: "warning",
        icon: "❌",
      });
    }
  };

  const handleInventoryAction = (itemId: number, action: "view" | "edit" | "delete") => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    switch (action) {
      case "view":
        addNotification({
          title: "Viewing Product",
          message: `Opening details for ${item.name}`,
          type: "info",
          icon: "👁️",
        });
        break;
      case "edit":
        addNotification({
          title: "Edit Product",
          message: `Opening edit form for ${item.name}`,
          type: "info",
          icon: "✏️",
        });
        break;
      case "delete":
        addNotification({
          title: "Delete Product",
          message: `${item.name} will be removed from inventory`,
          type: "warning",
          icon: "🗑️",
        });
        break;
    }
  };

  const handleAddProduct = () => {
    addNotification({
      title: "Add New Product",
      message: "Opening product creation form",
      type: "info",
      icon: "➕",
    });
  };

  const chatWithVendor = (vendorName: string, vendorPhone: string, orderId?: string) => {
    chatWithSupplier({
      supplierName: vendorName,
      supplierPhone: vendorPhone,
      customMessage: orderId
        ? `Hi ${vendorName}! This is Kumar Oil Mills regarding your order ${orderId}. Please let me know if you have any questions about your order status or delivery details.`
        : `Hi ${vendorName}! This is Kumar Oil Mills. Thank you for your interest in our products. How can I help you today?`,
      vendorName: "Kumar Oil Mills",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JB</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
                  JugaduBazar
                </span>
              </Link>
              <Badge className="bg-emerald-100 text-emerald-700">
                Supplier Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationPanel />
              <Link to="/supplier/profile" className="flex items-center">
                <ProfilePhoto
                  currentImage={profileImage}
                  userName={user?.name || "User"}
                  size="sm"
                  onImageChange={(url) => {
                    setProfileImage(url);
                  }}
                />
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Kumar Oil Mills!
          </h1>
          <p className="text-gray-600">
            Manage your inventory and orders efficiently
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/supplier/inventory">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="w-8 h-8 text-emerald-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {inventory.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/supplier/pending-orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingBag className="w-8 h-8 text-saffron-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentOrders.filter((o) => o.status === "pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/supplier/revenue">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹32,450</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/supplier/completed-orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Completed Orders</p>
                    <p className="text-2xl font-bold text-gray-900">187</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Orders Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.vendor}
                        </p>
                        <p className="text-sm text-gray-500">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.amount}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Your best performing items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory
                    .sort((a, b) => b.orders - a.orders)
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.orders} orders</p>
                          <p className="text-sm text-green-600">
                            ₹{item.revenue}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Inventory Management
              </h2>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                onClick={handleAddProduct}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Inventory Grid */}
            <div className="grid gap-6">
              {inventory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">{item.category}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>
                            Price: ₹{item.price}/{item.unit}
                          </span>
                          <span>
                            Stock: {item.stock} {item.unit}
                          </span>
                          <span>Orders: {item.orders}</span>
                          <span>Revenue: ₹{item.revenue}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInventoryAction(item.id, "view")}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInventoryAction(item.id, "edit")}
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleInventoryAction(item.id, "delete")}
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Management
            </h2>

            {/* Orders List */}
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>

                        {/* Vendor Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <h4 className="font-medium text-gray-900 mb-2">Vendor Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Name:</span>
                              <span className="ml-2 font-medium">{order.vendor}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <span className="ml-2 font-medium">{order.vendorPhone}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-gray-600">Location:</span>
                              <span className="ml-2 font-medium">{order.vendorLocation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">Order Items</h4>
                          <p className="text-sm text-gray-600 mb-2">{order.items}</p>
                        </div>

                        {/* Payment & Date Info */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="text-gray-600">Amount:</span>
                            <span className="ml-1 font-semibold text-green-600">₹{order.amount}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">Date:</span>
                            <span className="ml-1">{order.date}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">Payment:</span>
                            <span className="ml-1">{order.status === "delivered" ? "Completed" : "Pending"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="flex items-center space-x-2">
                          {order.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleOrderAction(order.id, "accept")}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleOrderAction(order.id, "reject")}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                addNotification({
                                  title: "Order Marked as Delivered",
                                  message: `Order ${order.id} has been marked as delivered`,
                                  type: "success",
                                  icon: "✅",
                                });
                              }}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Mark Delivered
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              addNotification({
                                title: "Viewing Order Details",
                                message: `Opening detailed view for order ${order.id}`,
                                type: "info",
                                icon: "👁️",
                              });
                            }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* WhatsApp Chat Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => chatWithVendor(order.vendor, order.vendorPhone, order.id)}
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 w-full"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
