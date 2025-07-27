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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Package,
} from "lucide-react";

// Mock inventory data
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
    description: "High-quality mustard oil for cooking",
    minStock: 10,
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
    description: "Authentic blend of aromatic spices",
    minStock: 5,
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
    description: "Premium long-grain basmati rice",
    minStock: 20,
  },
  {
    id: 4,
    name: "Red Chili Powder",
    category: "Spices",
    price: 280,
    stock: 15,
    unit: "kg",
    status: "active",
    orders: 22,
    revenue: 6160,
    description: "Spicy red chili powder",
    minStock: 8,
  },
  {
    id: 5,
    name: "Turmeric Powder",
    category: "Spices",
    price: 250,
    stock: 30,
    unit: "kg",
    status: "active",
    orders: 16,
    revenue: 4000,
    description: "Pure turmeric powder",
    minStock: 10,
  },
];

export default function SupplierInventory() {
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");

  React.useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "out-of-stock":
        return "bg-red-100 text-red-700";
      case "low-stock":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage your products and stock levels</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-emerald-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inventory.filter(item => item.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inventory.filter(item => item.status === "out-of-stock").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inventory.filter(item => item.stock <= item.minStock && item.stock > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add Product */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
          {filteredInventory.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      {item.stock <= item.minStock && item.stock > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <p className="text-gray-600 mb-3">{item.category}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-2 font-medium">₹{item.price}/{item.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <span className={`ml-2 font-medium ${item.stock <= item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                          {item.stock} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="ml-2 font-medium">{item.orders}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Revenue:</span>
                        <span className="ml-2 font-medium text-green-600">₹{item.revenue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
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
      </div>
    </div>
  );
}
