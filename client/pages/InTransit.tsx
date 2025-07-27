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
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle,
  Circle,
  RefreshCw,
  MessageCircle,
} from "lucide-react";

interface InTransitOrder {
  id: string;
  orderId: string;
  supplier: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  totalAmount: number;
  trackingNumber: string;
  estimatedDelivery: string;
  currentLocation: string;
  progress: number;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  timeline: Array<{
    status: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }>;
}

const mockInTransitOrders: InTransitOrder[] = [
  {
    id: "1",
    orderId: "ORD-2025-004",
    supplier: "Organic Vegetables",
    items: [
      { name: "Fresh Onions", quantity: 5, unit: "kg" },
      { name: "Tomatoes", quantity: 3, unit: "kg" },
    ],
    totalAmount: 580,
    trackingNumber: "TRK123456",
    estimatedDelivery: "2025-01-27 14:30",
    currentLocation: "Near Sector 18, Noida",
    progress: 75,
    driverName: "Ramesh Kumar",
    driverPhone: "+91 98765 43210",
    vehicleNumber: "UP14 AB 1234",
    timeline: [
      {
        status: "Order Confirmed",
        location: "Supplier Warehouse - Faridabad",
        timestamp: "2025-01-25 09:00",
        completed: true,
      },
      {
        status: "Package Prepared",
        location: "Faridabad",
        timestamp: "2025-01-25 11:30",
        completed: true,
      },
      {
        status: "Out for Delivery",
        location: "Left Faridabad Hub",
        timestamp: "2025-01-27 08:00",
        completed: true,
      },
      {
        status: "In Transit",
        location: "Near Sector 18, Noida",
        timestamp: "2025-01-27 12:45",
        completed: true,
      },
      {
        status: "Delivered",
        location: "Your Location",
        timestamp: "Expected: 14:30",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    orderId: "ORD-2025-006",
    supplier: "Spice Kingdom",
    items: [
      { name: "Turmeric Powder", quantity: 1, unit: "kg" },
      { name: "Coriander Seeds", quantity: 500, unit: "g" },
    ],
    totalAmount: 450,
    trackingNumber: "TRK789012",
    estimatedDelivery: "2025-01-27 16:00",
    currentLocation: "Delhi - Ghaziabad Highway",
    progress: 60,
    driverName: "Suresh Singh",
    driverPhone: "+91 87654 32109",
    vehicleNumber: "DL10 CD 5678",
    timeline: [
      {
        status: "Order Confirmed",
        location: "Supplier Warehouse - Old Delhi",
        timestamp: "2025-01-26 10:00",
        completed: true,
      },
      {
        status: "Package Prepared",
        location: "Old Delhi",
        timestamp: "2025-01-26 14:00",
        completed: true,
      },
      {
        status: "Out for Delivery",
        location: "Left Delhi Hub",
        timestamp: "2025-01-27 09:30",
        completed: true,
      },
      {
        status: "In Transit",
        location: "Delhi - Ghaziabad Highway",
        timestamp: "2025-01-27 13:15",
        completed: true,
      },
      {
        status: "Delivered",
        location: "Your Location",
        timestamp: "Expected: 16:00",
        completed: false,
      },
    ],
  },
];

export default function InTransit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders] = useState<InTransitOrder[]>(mockInTransitOrders);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshTracking = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Tracking Updated",
        description: "Latest delivery information has been fetched",
      });
    }, 1500);
  };

  const handleCallDriver = (driverName: string, phone: string) => {
    toast({
      title: "Calling Driver",
      description: `Connecting you with ${driverName} at ${phone}`,
    });
  };

  const handleTrackOnMap = (trackingNumber: string) => {
    toast({
      title: "Track on Map",
      description: `Opening live location for ${trackingNumber}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/vendor/dashboard"
                className="flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
              >
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
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-700">
                In Transit
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshTracking}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Updating..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Orders In Transit
          </h1>
          <p className="text-gray-600">
            Real-time tracking of your deliveries currently on the way
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Avg. ETA</p>
                  <p className="text-2xl font-bold text-gray-900">2.5 hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transit Orders */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders in transit
                </h3>
                <p className="text-gray-500">
                  All your orders are either pending or have been delivered
                </p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.orderId}</CardTitle>
                      <CardDescription>
                        From {order.supplier} • Tracking: {order.trackingNumber}
                      </CardDescription>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      <Truck className="w-4 h-4 mr-1" />
                      In Transit
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Delivery Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          Delivery Progress
                        </h4>
                        <span className="text-sm font-medium text-purple-600">
                          {order.progress}%
                        </span>
                      </div>

                      <Progress value={order.progress} className="mb-4" />

                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 text-red-500 mr-2" />
                          <span className="font-medium">Current Location:</span>
                          <span className="ml-2 text-gray-600">
                            {order.currentLocation}
                          </span>
                        </div>

                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="font-medium">
                            Expected Delivery:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {new Date(order.estimatedDelivery).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Driver Details
                        </h5>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Name:</strong> {order.driverName}
                          </p>
                          <p>
                            <strong>Vehicle:</strong> {order.vehicleNumber}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCallDriver(
                              order.driverName,
                              order.driverPhone,
                            )
                          }
                          className="flex-1"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Driver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrackOnMap(order.trackingNumber)}
                          className="flex-1"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Track on Map
                        </Button>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Tracking Timeline
                      </h4>
                      <div className="space-y-4">
                        {order.timeline.map((event, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              {event.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p
                                className={`text-sm font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`}
                              >
                                {event.status}
                              </p>
                              <p className="text-xs text-gray-500">
                                {event.location}
                              </p>
                              <p className="text-xs text-gray-400">
                                {event.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Items */}
                      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Order Items
                        </h5>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-600 flex justify-between"
                            >
                              <span>{item.name}</span>
                              <span>
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Total Amount:</span>
                            <span className="text-green-600">
                              ₹{order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
