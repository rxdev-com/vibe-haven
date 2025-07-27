import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWhatsApp } from "@/lib/whatsapp";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";

// Mock pending orders data
const pendingOrders = [
  {
    id: "ORD001",
    vendor: "Rajesh's Chaat Corner",
    vendorPhone: "+91 98765 43210",
    vendorLocation: "CP, Delhi",
    items: "Mustard Oil (2L), Garam Masala (1kg)",
    amount: 680,
    status: "pending",
    date: "2024-01-15",
    urgency: "normal",
    notes: "Please deliver fresh stock",
  },
  {
    id: "ORD004",
    vendor: "Delhi Street Food",
    vendorPhone: "+91 98765 43211",
    vendorLocation: "Karol Bagh, Delhi",
    items: "Red Chili Powder (2kg), Turmeric (1kg)",
    amount: 810,
    status: "pending",
    date: "2024-01-15",
    urgency: "urgent",
    notes: "Urgent requirement for weekend rush",
  },
  {
    id: "ORD005",
    vendor: "Spice Corner",
    vendorPhone: "+91 98765 43212",
    vendorLocation: "Lajpat Nagar, Delhi",
    items: "Garam Masala (3kg)",
    amount: 960,
    status: "pending",
    date: "2024-01-14",
    urgency: "normal",
    notes: "",
  },
];

export default function SupplierPendingOrders() {
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const { chatWithSupplier } = useWhatsApp();
  const [profileImage, setProfileImage] = useState<string>("");

  React.useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-700";
      case "normal":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleOrderAction = (orderId: string, action: "accept" | "reject") => {
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

  const chatWithVendor = (vendorName: string, vendorPhone: string, orderId: string) => {
    chatWithSupplier({
      supplierName: vendorName,
      supplierPhone: vendorPhone,
      customMessage: `Hi ${vendorName}! This is Kumar Oil Mills regarding your order ${orderId}. I've received your order request and would like to discuss the details with you.`,
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
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/supplier">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Orders</h1>
            <p className="text-gray-600">Review and manage pending order requests</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Urgent Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingOrders.filter(order => order.urgency === "urgent").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{pendingOrders.reduce((sum, order) => sum + order.amount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {pendingOrders.map((order) => (
            <Card key={order.id} className={order.urgency === "urgent" ? "border-red-200 shadow-md" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getUrgencyColor(order.urgency)}>
                        {order.urgency}
                      </Badge>
                    </div>
                    
                    {/* Vendor Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Vendor Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {order.vendor.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.vendor}</p>
                            <p className="text-sm text-gray-500">Vendor</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">{order.vendorPhone}</span>
                        </div>
                        <div className="flex items-center md:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">{order.vendorLocation}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                      <p className="text-gray-600 mb-2">{order.items}</p>
                      {order.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Special Notes:</strong> {order.notes}
                          </p>
                        </div>
                      )}
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
                        <span className="ml-1">On Delivery</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col items-end space-y-3 ml-4">
                    <div className="flex items-center space-x-2">
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

        {pendingOrders.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending orders
            </h3>
            <p className="text-gray-500">
              All orders have been processed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
