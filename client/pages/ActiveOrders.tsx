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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageCircle,
} from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  supplier: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }>;
  totalAmount: number;
  status: "confirmed" | "preparing" | "ready" | "dispatched";
  orderDate: string;
  expectedDelivery: string;
  supplierLocation: string;
  supplierPhone: string;
  trackingNumber?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderId: "ORD-2025-001",
    supplier: "Kumar Oil Mills",
    items: [
      { name: "Pure Ghee", quantity: 5, unit: "kg", price: 450 },
      { name: "Mustard Oil", quantity: 2, unit: "L", price: 180 },
    ],
    totalAmount: 2610,
    status: "preparing",
    orderDate: "2025-01-26",
    expectedDelivery: "2025-01-28",
    supplierLocation: "Sector 15, Noida",
    supplierPhone: "+91 98765 43210",
  },
  {
    id: "2",
    orderId: "ORD-2025-002",
    supplier: "Fresh Spice Co.",
    items: [
      { name: "Garam Masala", quantity: 1, unit: "kg", price: 650 },
      { name: "Red Chili Powder", quantity: 500, unit: "g", price: 120 },
    ],
    totalAmount: 770,
    status: "confirmed",
    orderDate: "2025-01-26",
    expectedDelivery: "2025-01-29",
    supplierLocation: "Old Delhi",
    supplierPhone: "+91 87654 32109",
  },
  {
    id: "3",
    orderId: "ORD-2025-003",
    supplier: "Grain Merchants",
    items: [{ name: "Basmati Rice", quantity: 10, unit: "kg", price: 120 }],
    totalAmount: 1200,
    status: "ready",
    orderDate: "2025-01-25",
    expectedDelivery: "2025-01-27",
    supplierLocation: "Ghaziabad",
    supplierPhone: "+91 76543 21098",
  },
  {
    id: "4",
    orderId: "ORD-2025-004",
    supplier: "Organic Vegetables",
    items: [
      { name: "Fresh Onions", quantity: 5, unit: "kg", price: 80 },
      { name: "Tomatoes", quantity: 3, unit: "kg", price: 60 },
    ],
    totalAmount: 580,
    status: "dispatched",
    orderDate: "2025-01-25",
    expectedDelivery: "2025-01-27",
    supplierLocation: "Faridabad",
    supplierPhone: "+91 65432 10987",
    trackingNumber: "TRK123456",
  },
  {
    id: "5",
    orderId: "ORD-2025-005",
    supplier: "Dairy Fresh",
    items: [{ name: "Paneer", quantity: 2, unit: "kg", price: 350 }],
    totalAmount: 700,
    status: "confirmed",
    orderDate: "2025-01-26",
    expectedDelivery: "2025-01-28",
    supplierLocation: "Gurgaon",
    supplierPhone: "+91 54321 09876",
  },
];

export default function ActiveOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders] = useState<Order[]>(mockOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "preparing":
        return "bg-yellow-100 text-yellow-700";
      case "ready":
        return "bg-green-100 text-green-700";
      case "dispatched":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "preparing":
        return <Clock className="w-4 h-4" />;
      case "ready":
        return <Package className="w-4 h-4" />;
      case "dispatched":
        return <Truck className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleContactSupplier = (supplier: string, phone: string) => {
    toast({
      title: "Contact Supplier",
      description: `Calling ${supplier} at ${phone}`,
    });
  };

  const handleTrackOrder = (orderId: string) => {
    toast({
      title: "Track Order",
      description: `Opening tracking details for ${orderId}`,
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
            <Badge className="bg-saffron-100 text-saffron-700">
              Active Orders
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Active Orders
          </h1>
          <p className="text-gray-600">
            Track and manage your current orders from suppliers
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter((o) => o.status === "confirmed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Preparing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter((o) => o.status === "preparing").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Ready</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter((o) => o.status === "ready").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Dispatched</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter((o) => o.status === "dispatched").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders, suppliers, or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You don't have any active orders yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderId}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-2">
                        <strong>Supplier:</strong> {order.supplier}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {order.supplierLocation}
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Items:
                        </p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {item.name} - {item.quantity} {item.unit} @ ₹
                              {item.price}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          <strong>Order Date:</strong>{" "}
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                        <span>
                          <strong>Expected:</strong>{" "}
                          {new Date(
                            order.expectedDelivery,
                          ).toLocaleDateString()}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackOrder(order.orderId)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Track Order
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleContactSupplier(
                            order.supplier,
                            order.supplierPhone,
                          )
                        }
                        className="w-full"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Supplier
                      </Button>

                      {order.trackingNumber && (
                        <div className="text-xs text-center text-gray-500 mt-1">
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
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
