import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Truck, Phone } from "lucide-react";

interface DeliveryLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  estimatedTime: string;
  status: "delivered" | "in-transit" | "pending";
  orderValue: number;
  contactPhone: string;
}

const mockDeliveries: DeliveryLocation[] = [
  {
    id: "D001",
    name: "Rajesh's Chaat Corner",
    address: "Connaught Place, New Delhi",
    lat: 28.6315,
    lng: 77.2167,
    distance: 12.5,
    estimatedTime: "25 mins",
    status: "in-transit",
    orderValue: 2500,
    contactPhone: "+91 98765 43210"
  },
  {
    id: "D002", 
    name: "Mumbai Street Food",
    address: "Karol Bagh, New Delhi",
    lat: 28.6519,
    lng: 77.1914,
    distance: 8.2,
    estimatedTime: "18 mins",
    status: "pending",
    orderValue: 1800,
    contactPhone: "+91 87654 32109"
  },
  {
    id: "D003",
    name: "Delhi Spice Corner", 
    address: "Lajpat Nagar, New Delhi",
    lat: 28.5678,
    lng: 77.2434,
    distance: 15.1,
    estimatedTime: "32 mins",
    status: "delivered",
    orderValue: 3200,
    contactPhone: "+91 76543 21098"
  }
];

interface DeliveryMapProps {
  deliveries?: DeliveryLocation[];
}

export default function DeliveryMap({ deliveries = mockDeliveries }: DeliveryMapProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryLocation | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Mock current location (supplier's location)
  const supplierLocation = { lat: 28.6139, lng: 77.2090, name: "Kumar Oil Mills" };

  useEffect(() => {
    // Simulate getting current location
    setCurrentLocation(supplierLocation);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "in-transit": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return "✅";
      case "in-transit": return "🚛";
      case "pending": return "⏳";
      default: return "📦";
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Delivery Map
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-700">
              {deliveries.length} Active Deliveries
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mock Map Interface */}
          <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 border-2 border-dashed border-gray-300 overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gray-100 opacity-50">
              <div className="h-full w-full bg-gradient-to-br from-green-100 via-blue-100 to-gray-100"></div>
            </div>
            
            {/* Supplier Location (Center) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium">
                    📍 Kumar Oil Mills
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Locations */}
            {deliveries.map((delivery, index) => {
              const positions = [
                { top: "20%", left: "70%" },
                { top: "60%", left: "25%" },
                { top: "75%", left: "80%" },
              ];
              const position = positions[index % positions.length];
              
              return (
                <div
                  key={delivery.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: position.top, left: position.left }}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="relative">
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      delivery.status === "delivered" ? "bg-green-500" :
                      delivery.status === "in-transit" ? "bg-blue-500 animate-bounce" :
                      "bg-yellow-500"
                    }`}></div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-white px-1 py-0.5 rounded text-xs font-medium shadow-sm">
                        {getStatusIcon(delivery.status)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Mock Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <pattern id="dash" patternUnits="userSpaceOnUse" width="8" height="2">
                  <rect width="4" height="2" fill="currentColor" />
                </pattern>
              </defs>
              {deliveries.map((_, index) => {
                const routes = [
                  "M 50% 50% Q 60% 30% 70% 20%",
                  "M 50% 50% Q 30% 55% 25% 60%", 
                  "M 50% 50% Q 70% 65% 80% 75%"
                ];
                return (
                  <path
                    key={index}
                    d={routes[index % routes.length]}
                    stroke={deliveries[index]?.status === "in-transit" ? "#3b82f6" : "#6b7280"}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={deliveries[index]?.status === "pending" ? "5,5" : "none"}
                    className="opacity-60"
                  />
                );
              })}
            </svg>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="outline" className="bg-white/90">
                <Navigation className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90">
                +
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90">
                -
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-xs space-y-1">
              <div className="font-medium mb-2">Legend</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Supplier</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Delivered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>In Transit</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Active Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDelivery?.id === delivery.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{delivery.name}</h4>
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusIcon(delivery.status)} {delivery.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{delivery.address}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{delivery.distance} km • {delivery.estimatedTime}</span>
                    <span className="font-medium text-green-600">₹{delivery.orderValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Delivery Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Delivery Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDelivery ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedDelivery.name}</h3>
                  <p className="text-gray-600">{selectedDelivery.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      Distance
                    </div>
                    <div className="font-semibold">{selectedDelivery.distance} km</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      ETA
                    </div>
                    <div className="font-semibold">{selectedDelivery.estimatedTime}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Order Value</span>
                  <span className="text-xl font-bold text-green-600">₹{selectedDelivery.orderValue}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Contact</span>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {selectedDelivery.contactPhone}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a delivery from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
