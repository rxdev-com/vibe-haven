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
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import LanguageSelector, { useTranslation, SupportedLanguage } from "@/components/LanguageSelector";
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Truck,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Real-time order data for the logged-in user
const getActiveOrdersForUser = (userId: string) => [
  {
    id: "ORD001",
    supplierName: "Kumar Oil Mills",
    supplierPhone: "+91 87654 32109",
    supplierLocation: "Industrial Area, Noida",
    items: [
      { name: "Premium Mustard Oil", quantity: 2, unit: "liter", price: 180 },
      { name: "Garam Masala Powder", quantity: 1, unit: "kg", price: 320 }
    ],
    totalAmount: 680,
    status: "confirmed",
    orderDate: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-16T14:00:00Z",
    currentLocation: "Out for delivery",
    trackingId: "TRK001234",
    paymentStatus: "paid",
    notes: "Please deliver before 2 PM",
    priority: "normal"
  },
  {
    id: "ORD002", 
    supplierName: "Delhi Spice Corner",
    supplierPhone: "+91 76543 21098",
    supplierLocation: "Chandni Chowk, Delhi",
    items: [
      { name: "Premium Saffron", quantity: 100, unit: "gram", price: 800 },
      { name: "Red Chili Powder", quantity: 2, unit: "kg", price: 280 }
    ],
    totalAmount: 1360,
    status: "processing",
    orderDate: "2024-01-15T14:20:00Z",
    estimatedDelivery: "2024-01-17T16:00:00Z",
    currentLocation: "Being prepared",
    trackingId: "TRK001235",
    paymentStatus: "pending",
    notes: "High-quality saffron required",
    priority: "high"
  },
  {
    id: "ORD003",
    supplierName: "Fresh Vegetables Co",
    supplierPhone: "+91 98765 43210",
    supplierLocation: "Azadpur Mandi, Delhi",
    items: [
      { name: "Fresh Onions", quantity: 10, unit: "kg", price: 40 },
      { name: "Tomatoes", quantity: 5, unit: "kg", price: 60 },
      { name: "Green Chilies", quantity: 2, unit: "kg", price: 80 }
    ],
    totalAmount: 740,
    status: "shipped",
    orderDate: "2024-01-14T09:15:00Z", 
    estimatedDelivery: "2024-01-15T18:00:00Z",
    currentLocation: "In transit - 5 km away",
    trackingId: "TRK001233",
    paymentStatus: "paid",
    notes: "Handle with care - perishable items",
    priority: "urgent"
  }
];

export default function VendorActiveOrders() {
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const { t } = useTranslation(language);
  const [profileImage, setProfileImage] = useState<string>("");
  const [orders, setOrders] = useState(getActiveOrdersForUser(user?.id || ""));
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);
    
    const savedLang = localStorage.getItem("preferred_language") as SupportedLanguage;
    if (savedLang) setLanguage(savedLang);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrders(prev => prev.map(order => {
        if (order.status === "shipped" && Math.random() > 0.7) {
          return { ...order, currentLocation: "Delivered ✅" };
        }
        return order;
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-yellow-100 text-yellow-700"; 
      case "shipped": return "bg-green-100 text-green-700";
      case "delivered": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "normal": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleContactSupplier = (order: any) => {
    addNotification({
      title: "Opening WhatsApp",
      message: `Contacting ${order.supplierName} about order ${order.id}`,
      type: "info",
      icon: "📱",
    });
  };

  const handleTrackOrder = (orderId: string) => {
    // Navigate to live tracking page
    window.location.href = `/track-order/${orderId}`;
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
              <Badge className="bg-saffron-100 text-saffron-700">
                {t('activeOrders')}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <NotificationPanel />
              <Link to="/vendor/profile" className="flex items-center">
                <ProfilePhoto
                  currentImage={profileImage}
                  userName={user?.name || "User"}
                  size="sm"
                  onImageChange={(url) => setProfileImage(url)}
                />
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/vendor/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')} to {t('dashboard')}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('activeOrders')}</h1>
            <p className="text-gray-600">Track your current orders and deliveries</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Active</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === "processing").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Shipped</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === "shipped").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(order.orderDate)}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Supplier Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Supplier Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {order.supplierName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{order.supplierName}</p>
                        <p className="text-sm text-gray-500">Supplier</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">{order.supplierLocation}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">{order.supplierPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity} {item.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price * item.quantity}</p>
                          <p className="text-sm text-gray-500">₹{item.price}/{item.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Status */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Delivery Status</h4>
                    <span className="text-sm text-blue-600 font-medium">
                      Track ID: {order.trackingId}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Location</p>
                      <p className="font-medium">{order.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-medium">{formatDateTime(order.estimatedDelivery)}</p>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleTrackOrder(order.id)}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order Live
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleContactSupplier(order)}
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Supplier
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {order.paymentStatus === "pending" && (
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Make Payment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active orders
            </h3>
            <p className="text-gray-500">
              Your completed and current orders will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
