import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  ArrowLeft, 
  Search,
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  MessageSquare
} from "lucide-react";

interface Order {
  id: string;
  supplier: string;
  items: string;
  amount: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  date: string;
  estimatedDelivery: string;
  supplierPhone: string;
  supplierRating: number;
  trackingSteps: {
    step: string;
    time: string;
    completed: boolean;
    description: string;
  }[];
}

export default function OrderTracking() {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const orders: Order[] = [
    {
      id: "ORD001",
      supplier: "Kumar Oil Mills",
      items: "Premium Mustard Oil (2L), Garam Masala (1kg)",
      amount: 680,
      status: "out_for_delivery",
      date: "2024-01-15",
      estimatedDelivery: "Today, 3:00 PM",
      supplierPhone: "+91 98765 43210",
      supplierRating: 4.5,
      trackingSteps: [
        { step: "Order Placed", time: "10:30 AM", completed: true, description: "Order confirmed by supplier" },
        { step: "Preparing", time: "11:00 AM", completed: true, description: "Items being packed" },
        { step: "Out for Delivery", time: "2:15 PM", completed: true, description: "On the way to your location" },
        { step: "Delivered", time: "3:00 PM", completed: false, description: "Order will be delivered" }
      ]
    },
    {
      id: "ORD002",
      supplier: "Spice Garden",
      items: "Red Chili Powder (1kg), Turmeric (500g)",
      amount: 420,
      status: "confirmed",
      date: "2024-01-15",
      estimatedDelivery: "Tomorrow, 11:00 AM",
      supplierPhone: "+91 87654 32109",
      supplierRating: 4.8,
      trackingSteps: [
        { step: "Order Placed", time: "2:45 PM", completed: true, description: "Order confirmed by supplier" },
        { step: "Preparing", time: "", completed: false, description: "Items being prepared" },
        { step: "Out for Delivery", time: "", completed: false, description: "Will be dispatched soon" },
        { step: "Delivered", time: "", completed: false, description: "Order will be delivered" }
      ]
    },
    {
      id: "ORD003",
      supplier: "Fresh Veggie Hub",
      items: "Fresh Onions (5kg), Potatoes (3kg)",
      amount: 245,
      status: "delivered",
      date: "2024-01-14",
      estimatedDelivery: "Delivered",
      supplierPhone: "+91 76543 21098",
      supplierRating: 4.2,
      trackingSteps: [
        { step: "Order Placed", time: "9:15 AM", completed: true, description: "Order confirmed by supplier" },
        { step: "Preparing", time: "9:45 AM", completed: true, description: "Items packed and ready" },
        { step: "Out for Delivery", time: "11:30 AM", completed: true, description: "Dispatched for delivery" },
        { step: "Delivered", time: "1:20 PM", completed: true, description: "Successfully delivered" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "preparing": return "bg-purple-100 text-purple-700";
      case "out_for_delivery": return "bg-orange-100 text-orange-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case "pending": return 25;
      case "confirmed": return 25;
      case "preparing": return 50;
      case "out_for_delivery": return 75;
      case "delivered": return 100;
      default: return 0;
    }
  };

  const handleContactSupplier = (supplier: string, phone: string) => {
    addNotification({
      title: "Contact Information",
      message: `${supplier}: ${phone}`,
      type: "info",
      icon: "📞"
    });
  };

  const handleRateOrder = (orderId: string) => {
    addNotification({
      title: "Rating Submitted",
      message: "Thank you for rating your order experience!",
      type: "success",
      icon: "⭐"
    });
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeOrders = filteredOrders.filter(order => 
    order.status !== "delivered" && order.status !== "cancelled"
  );
  const completedOrders = filteredOrders.filter(order => 
    order.status === "delivered" || order.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/vendor/dashboard" className="flex items-center text-gray-600 hover:text-saffron-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
                JugaduBazar
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600">Track your orders and delivery status</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders by ID, supplier, or items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders</h3>
                  <p className="text-gray-500 mb-4">You don't have any active orders at the moment</p>
                  <Link to="/vendor/dashboard">
                    <Button className="bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600">
                      Browse Materials
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-3">
                          <span>{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{order.supplier}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{order.amount}</p>
                        <p className="text-sm text-gray-500">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      <p className="font-medium">{order.items}</p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Order Progress</span>
                        <span className="text-sm text-gray-500">{getProgress(order.status)}%</span>
                      </div>
                      <Progress value={getProgress(order.status)} className="h-2" />
                    </div>

                    {/* Tracking Steps */}
                    <div className="space-y-3">
                      {order.trackingSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {step.completed && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step.step}
                              </span>
                              {step.time && (
                                <span className="text-sm text-gray-500">{step.time}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactSupplier(order.supplier, order.supplierPhone)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Supplier
                        </Button>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {order.supplierRating}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Orders</h3>
                  <p className="text-gray-500">Your completed orders will appear here</p>
                </CardContent>
              </Card>
            ) : (
              completedOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">{order.supplier}</p>
                        <p className="text-sm text-gray-500 mb-2">{order.items}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Amount: ₹{order.amount}</span>
                          <span>Date: {order.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRateOrder(order.id)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate
                        </Button>
                        <Button variant="ghost" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
