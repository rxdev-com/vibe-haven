import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector, { useTranslation, SupportedLanguage } from "@/components/LanguageSelector";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageSquare,
  Truck,
  Clock,
  Navigation,
  User,
  Package,
  Star,
} from "lucide-react";

// Mock order tracking data
const getOrderTrackingData = (orderId: string) => ({
  id: orderId,
  status: "in_transit",
  supplier: {
    name: "Kumar Oil Mills",
    phone: "+91 87654 32109",
    location: "Industrial Area, Noida",
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  vendor: {
    name: "Rajesh's Chaat Corner", 
    phone: "+91 98765 43210",
    address: "Connaught Place, New Delhi",
    coordinates: { lat: 28.6315, lng: 77.2167 }
  },
  driver: {
    name: "Suresh Kumar",
    phone: "+91 99999 12345",
    vehicle: "HR 26 DL 1234",
    rating: 4.8,
    photo: "👨‍💼",
    currentLocation: { lat: 28.6200, lng: 77.2100 }
  },
  items: [
    { name: "Premium Mustard Oil", quantity: 2, unit: "liter" },
    { name: "Garam Masala Powder", quantity: 1, unit: "kg" }
  ],
  totalAmount: 680,
  estimatedDelivery: "2024-01-16T14:00:00Z",
  milestones: [
    { status: "confirmed", time: "10:30 AM", completed: true },
    { status: "prepared", time: "11:45 AM", completed: true },
    { status: "picked_up", time: "12:15 PM", completed: true },
    { status: "in_transit", time: "12:30 PM", completed: true },
    { status: "delivered", time: "2:00 PM (Est)", completed: false }
  ]
});

export default function OrderTrackingLive() {
  const { orderId } = useParams();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const { t } = useTranslation(language);
  const [orderData, setOrderData] = useState(getOrderTrackingData(orderId || ""));
  const [driverLocation, setDriverLocation] = useState(orderData.driver.currentLocation);
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);
    
    const savedLang = localStorage.getItem("preferred_language") as SupportedLanguage;
    if (savedLang) setLanguage(savedLang);

    // Simulate live tracking updates
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (point1: any, point2: any) => {
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const remainingDistance = calculateDistance(driverLocation, orderData.vendor.coordinates);
  const estimatedTime = Math.ceil(remainingDistance * 4); // rough estimate in minutes

  const callDriver = () => {
    addNotification({
      title: "Calling Driver",
      message: `Connecting to ${orderData.driver.name}`,
      type: "info",
      icon: "📞",
    });
  };

  const contactSupplier = () => {
    addNotification({
      title: "Opening WhatsApp",
      message: `Contacting ${orderData.supplier.name}`,
      type: "info",
      icon: "💬",
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
              <Badge className="bg-green-100 text-green-700">
                Live Tracking
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
              <NotificationPanel />
              <ProfilePhoto
                currentImage={profileImage}
                userName={user?.name || "User"}
                size="sm"
                onImageChange={(url) => setProfileImage(url)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/vendor/active-orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Order Tracking</h1>
            <p className="text-gray-600">Track your order #{orderData.id} in real-time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Live Map Tracking
                  </span>
                  <Badge className="bg-green-100 text-green-700 animate-pulse">
                    🟢 Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mock Live Map */}
                <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 border-2 border-gray-200 overflow-hidden">
                  {/* Map Background */}
                  <div className="absolute inset-0">
                    <div className="h-full w-full bg-gradient-to-br from-green-100 via-blue-100 to-gray-100 opacity-60"></div>
                    {/* Grid lines for map effect */}
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Supplier Location */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center bg-white rounded-lg shadow-md p-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-xs font-medium">📍 Supplier</span>
                    </div>
                  </div>

                  {/* Driver Location (Moving) */}
                  <div 
                    className="absolute transition-all duration-3000 ease-linear"
                    style={{ 
                      top: `${30 + Math.sin(Date.now() / 3000) * 10}%`, 
                      left: `${40 + Math.cos(Date.now() / 3000) * 15}%` 
                    }}
                  >
                    <div className="relative">
                      <div className="w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg animate-bounce">
                        <span className="absolute -top-1 -right-1 text-xs">🚛</span>
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {orderData.driver.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Location */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center bg-white rounded-lg shadow-md p-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-xs font-medium">🏪 Your Location</span>
                    </div>
                  </div>

                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 20% 20% Q 50% 60% 80% 80%"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8,4"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Distance & ETA Overlay */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Distance Remaining</p>
                      <p className="text-lg font-bold text-green-600">{remainingDistance.toFixed(1)} km</p>
                      <p className="text-xs text-gray-600 mt-1">ETA: {estimatedTime} mins</p>
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Supplier</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Driver</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Your Location</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Navigation className="w-4 h-4 mr-2" />
                    Full Screen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Driver Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Driver Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                    {orderData.driver.photo}
                  </div>
                  <div>
                    <p className="font-semibold">{orderData.driver.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {orderData.driver.rating} Rating
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{orderData.driver.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{orderData.driver.phone}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-green-500 hover:bg-green-600"
                  onClick={callDriver}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Driver
                </Button>
              </CardContent>
            </Card>

            {/* Order Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.completed && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          milestone.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {milestone.status.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">{milestone.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={contactSupplier}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Supplier
                </Button>
                <Button variant="outline" className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  View Order Details
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  <Clock className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
