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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import DatabaseStatus from "@/components/DatabaseStatus";
import { useWhatsApp, CHAT_TEMPLATES } from "@/lib/whatsapp";
import { mockMaterials } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Plus,
  MapPin,
  Truck,
  Bell,
  User,
  Package,
  Heart,
  Navigation,
  MapPinOff,
  Loader2,
  MessageSquare,
  Store,
  Tags,
  ShoppingBag as Bag,
} from "lucide-react";

// Helper function to calculate distance between two coordinates
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Use mock materials for development
const baseMaterials = mockMaterials;

const categories = [
  "All",
  "Oils & Fats",
  "Spices",
  "Grains",
  "Vegetables",
  "Dairy",
];

interface UserLocation {
  lat: number;
  lon: number;
}

export default function VendorDashboard() {
  const { addItem, removeItem, isInCart, totalItems } = useCart();
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const { chatWithSupplier } = useWhatsApp();
  const { language, setLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("distance");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [locationError, setLocationError] = useState<string>("");
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");

  // Load saved profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationStatus("success");
        },
        (error) => {
          setLocationStatus("error");
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "Location access denied. Please enable location services.",
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError("An error occurred while retrieving location.");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      );
    } else {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Calculate materials with distances (using existing distance from mock data)
  const materialsWithDistance = baseMaterials.map((material) => {
    let distance = material.distance || 0;
    let location = material.location || "Location unavailable";

    // If user location is available, you could recalculate distance here
    // For now, we'll use the mock data distances

    return {
      ...material,
      distance,
      location,
      supplierAddress: material.supplierAddress || "Address unavailable",
    };
  });

  const filteredMaterials = materialsWithDistance
    .filter((material) => {
      const matchesSearch = material.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || material.category === selectedCategory;
      const withinRange = !showNearbyOnly || material.distance <= 5; // Within 5km if nearby filter is on

      return matchesSearch && matchesCategory && withinRange;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return a.distance - b.distance;
        default:
          return 0;
      }
    });

  const handleAddToCart = (material: any) => {
    addItem({
      id: material.id,
      name: material.name,
      price: material.price,
      unit: material.unit,
      supplier: material.supplier?.businessName || material.supplier,
      category: material.category,
      image: material.image,
    });

    addNotification({
      title: "Added to Cart",
      message: `${material.name} has been added to your cart`,
      type: "success",
      icon: "🛒",
    });
  };

  const handleRemoveFromCart = (material: any) => {
    removeItem(material.id);

    addNotification({
      title: "Removed from Cart",
      message: `${material.name} has been removed from your cart`,
      type: "info",
      icon: "🗑️",
    });
  };

  const handleLikeItem = (materialId: string, materialName: string) => {
    const isCurrentlyLiked = likedItems.includes(materialId);

    if (isCurrentlyLiked) {
      setLikedItems((prev) => prev.filter((id) => id !== materialId));
    } else {
      setLikedItems((prev) => [...prev, materialId]);

      addNotification({
        title: "Item Liked",
        message: `You liked ${materialName}. We'll notify you of offers!`,
        type: "success",
        icon: "❤️",
      });
    }
  };

  const refreshLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus("loading");
      setLocationError("");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationStatus("success");
        },
        (error) => {
          setLocationStatus("error");
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "Location access denied. Please enable location services.",
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError("An error occurred while retrieving location.");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Force fresh location
        },
      );
    }
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
                Vendor Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <NotificationPanel />
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-500 text-white rounded-full text-xs flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/vendor/profile" className="flex items-center">
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
            {t('welcomeBack')}, {user?.name || "Rajesh"}!
          </h1>
          <p className="text-gray-600">
            {t('findSuppliers')} - Find the best raw materials for your street food business
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/vendor/active-orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="w-8 h-8 text-saffron-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/vendor/in-transit">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Truck className="w-8 h-8 text-emerald-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">In Transit</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/vendor/rating">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/vendor/saved-items">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Saved Items</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Vendor-to-Vendor Marketplace Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vendor Marketplace</h2>
              <p className="text-gray-600">Buy and sell items with other vendors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/vendor/marketplace">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Browse</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    Browse Items
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Find unused items from other vendors at great prices
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">24 items available</span>
                    <span className="text-blue-600 font-medium">View All →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/vendor/sell-items">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Tags className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-green-100 text-green-700">Sell</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                    Sell Your Items
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    List unused inventory to other vendors quickly
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">3 items listed</span>
                    <span className="text-green-600 font-medium">List Item →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/vendor/my-listings">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Bag className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">Manage</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                    My Listings
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Manage your listed items and view inquiries
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">2 active listings</span>
                    <span className="text-orange-600 font-medium">Manage →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Database Status Check */}
        <div className="mb-6">
          <DatabaseStatus />
        </div>

        {/* Location Status */}
        {locationStatus !== "idle" && (
          <div className="mb-6">
            {locationStatus === "loading" && (
              <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription className="ml-2">
                  Getting your location to show nearby suppliers...
                </AlertDescription>
              </Alert>
            )}

            {locationStatus === "success" && userLocation && (
              <Alert className="border-green-200 bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                      Location detected! Showing suppliers near you.
                    </AlertDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshLocation}
                    disabled={locationStatus === "loading"}
                  >
                    {locationStatus === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                    Refresh
                  </Button>
                </div>
              </Alert>
            )}

            {locationStatus === "error" && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <MapPinOff className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {locationError} Showing all suppliers with approximate
                  distances.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for raw materials..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location-based filters */}
          {userLocation && (
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                variant={showNearbyOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowNearbyOnly(!showNearbyOnly)}
                className={
                  showNearbyOnly ? "bg-emerald-500 hover:bg-emerald-600" : ""
                }
              >
                <MapPin className="w-4 h-4 mr-2" />
                {showNearbyOnly ? "Showing Nearby (5km)" : "Show Nearby Only"}
              </Button>
              <span className="text-sm text-gray-500">
                {filteredMaterials.length} supplier
                {filteredMaterials.length !== 1 ? "s" : ""} found
              </span>
            </div>
          )}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  {!material.inStock && (
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-white text-gray-700">
                    {material.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-saffron-600 transition-colors">
                    {material.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => handleLikeItem(material.id, material.name)}
                  >
                    <Heart
                      className={`w-4 h-4 ${likedItems.includes(material.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </Button>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  {material.supplier?.businessName || material.supplier}
                </p>

                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{material.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({material.reviews})
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin
                    className={`w-4 h-4 mr-1 ${userLocation && material.distance <= 2 ? "text-green-500" : "text-gray-400"}`}
                  />
                  <span className="font-medium">
                    {userLocation
                      ? material.location
                      : material.supplierAddress}
                  </span>
                  {userLocation && material.distance <= 2 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-green-100 text-green-700 text-xs"
                    >
                      Very Close
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{material.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {material.unit}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Stock: {material.stock} kg
                  </div>
                </div>

                <div className="flex gap-2">
                  {isInCart(material.id) ? (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleRemoveFromCart(material)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                      onClick={() => handleAddToCart(material)}
                      disabled={!material.inStock}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                  <Link to={`/material/${material.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      chatWithSupplier({
                        supplierName:
                          material.supplier?.businessName || material.supplier,
                        supplierPhone: "+91 98765 43210", // Mock phone number
                        materialName: material.name,
                        materialPrice: material.price,
                        materialUnit: material.unit,
                        vendorName: user?.name || "Vendor",
                      })
                    }
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No materials found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
