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
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useWhatsApp } from "@/lib/whatsapp";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Search,
  Filter,
  Star,
  MapPin,
  Package,
  Trash2,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  MessageSquare,
} from "lucide-react";

interface SavedItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: string;
  supplierLocation: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
  savedDate: string;
  lastPriceCheck: string;
  priceChange: number; // percentage change since saved
  description: string;
  minimumOrder: number;
}

const mockSavedItems: SavedItem[] = [
  {
    id: "1",
    name: "Premium Basmati Rice",
    category: "Grains & Cereals",
    price: 120,
    unit: "kg",
    supplier: "Grain Merchants",
    supplierLocation: "Ghaziabad, UP",
    rating: 4.8,
    reviews: 45,
    inStock: true,
    image: "/api/placeholder/150/150",
    savedDate: "2025-01-20",
    lastPriceCheck: "2025-01-26",
    priceChange: -5, // 5% price drop
    description: "Long grain premium basmati rice with excellent aroma",
    minimumOrder: 5,
  },
  {
    id: "2",
    name: "Pure Ghee",
    category: "Dairy & Fats",
    price: 450,
    unit: "kg",
    supplier: "Kumar Oil Mills",
    supplierLocation: "Noida, UP",
    rating: 4.9,
    reviews: 78,
    inStock: true,
    image: "/api/placeholder/150/150",
    savedDate: "2025-01-18",
    lastPriceCheck: "2025-01-26",
    priceChange: 2, // 2% price increase
    description: "Traditional pure cow ghee made from fresh cream",
    minimumOrder: 1,
  },
  {
    id: "3",
    name: "Garam Masala Powder",
    category: "Spices & Seasonings",
    price: 650,
    unit: "kg",
    supplier: "Fresh Spice Co.",
    supplierLocation: "Old Delhi",
    rating: 4.7,
    reviews: 32,
    inStock: true,
    image: "/api/placeholder/150/150",
    savedDate: "2025-01-15",
    lastPriceCheck: "2025-01-26",
    priceChange: 0, // No price change
    description: "Freshly ground aromatic garam masala blend",
    minimumOrder: 1,
  },
  {
    id: "4",
    name: "Mustard Oil",
    category: "Oils & Fats",
    price: 180,
    unit: "L",
    supplier: "Kumar Oil Mills",
    supplierLocation: "Noida, UP",
    rating: 4.6,
    reviews: 54,
    inStock: false,
    image: "/api/placeholder/150/150",
    savedDate: "2025-01-12",
    lastPriceCheck: "2025-01-25",
    priceChange: 3, // 3% price increase
    description: "Cold pressed pure mustard oil for cooking",
    minimumOrder: 2,
  },
  {
    id: "5",
    name: "Red Chili Powder",
    category: "Spices & Seasonings",
    price: 240,
    unit: "kg",
    supplier: "Spice Garden",
    supplierLocation: "Faridabad, HR",
    rating: 4.5,
    reviews: 28,
    inStock: true,
    image: "/api/placeholder/150/150",
    savedDate: "2025-01-10",
    lastPriceCheck: "2025-01-26",
    priceChange: -8, // 8% price drop
    description: "Medium spicy red chili powder from Kashmiri chilies",
    minimumOrder: 1,
  },
];

export default function SavedItems() {
  const { user } = useAuth();
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();
  const { chatWithSupplier } = useWhatsApp();
  const [savedItems, setSavedItems] = useState<SavedItem[]>(mockSavedItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("saved-date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = Array.from(
    new Set(savedItems.map((item) => item.category)),
  );

  const filteredAndSortedItems = savedItems
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && item.inStock) ||
        (stockFilter === "out-of-stock" && !item.inStock);
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "saved-date":
        default:
          return (
            new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
          );
      }
    });

  const handleRemoveItem = (itemId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your saved list",
    });
  };

  const handleAddToCart = (item: SavedItem) => {
    if (!item.inStock) {
      toast({
        title: "Out of Stock",
        description: `${item.name} is currently out of stock`,
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      supplier: item.supplier,
      supplierLocation: item.supplierLocation,
      category: item.category,
      inStock: item.inStock,
      minimumOrder: item.minimumOrder,
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-red-600";
    if (change < 0) return "text-green-600";
    return "text-gray-600";
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return "↗";
    if (change < 0) return "↘";
    return "→";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
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
              <Badge className="bg-pink-100 text-pink-700">
                <Heart className="w-3 h-3 mr-1" />
                {savedItems.length} Saved
              </Badge>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Items</h1>
          <p className="text-gray-600">
            Keep track of your favorite materials and monitor price changes
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">
                {savedItems.length}
              </p>
              <p className="text-sm text-gray-600">Total Saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">
                {savedItems.filter((item) => item.inStock).length}
              </p>
              <p className="text-sm text-gray-600">In Stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-6 h-6 text-red-500 mx-auto mb-2 flex items-center justify-center">
                ↘
              </div>
              <p className="text-lg font-bold text-gray-900">
                {savedItems.filter((item) => item.priceChange < 0).length}
              </p>
              <p className="text-sm text-gray-600">Price Drops</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">
                {(
                  savedItems.reduce((sum, item) => sum + item.rating, 0) /
                  savedItems.length
                ).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Avg. Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search saved items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saved-date">Recently Saved</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid/List */}
        {filteredAndSortedItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No saved items found
              </h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== "all" || stockFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start saving items you're interested in for easy access later"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredAndSortedItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className={viewMode === "grid" ? "p-6" : "p-6"}>
                  <div
                    className={viewMode === "grid" ? "space-y-4" : "flex gap-6"}
                  >
                    {/* Item Image */}
                    <div
                      className={
                        viewMode === "grid"
                          ? "aspect-square bg-gray-100 rounded-lg"
                          : "w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0"
                      }
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package
                          className={
                            viewMode === "grid" ? "w-12 h-12" : "w-8 h-8"
                          }
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.supplier}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.supplierLocation}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {renderStars(Math.round(item.rating))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {item.rating} ({item.reviews} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{item.price}
                          </span>
                          <span className="text-sm text-gray-600">
                            /{item.unit}
                          </span>
                          {item.priceChange !== 0 && (
                            <div
                              className={`text-xs mt-1 ${getPriceChangeColor(item.priceChange)}`}
                            >
                              {getPriceChangeIcon(item.priceChange)}{" "}
                              {Math.abs(item.priceChange)}% since saved
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={item.inStock ? "default" : "secondary"}
                          className={
                            item.inStock ? "bg-green-100 text-green-700" : ""
                          }
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>

                      {/* Category and Description */}
                      <div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {item.category}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock || isInCart(item.id)}
                          className="flex-1 bg-gradient-to-r from-saffron-500 to-orange-500"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {isInCart(item.id) ? "In Cart" : "Add to Cart"}
                        </Button>
                        <Link to={`/material/${item.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            chatWithSupplier({
                              supplierName: item.supplier,
                              supplierPhone: "+91 98765 43210", // Mock phone - in real app get from item.supplierPhone
                              materialName: item.name,
                              materialPrice: item.price,
                              materialUnit: item.unit,
                              vendorName: user?.name || "Vendor",
                            })
                          }
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </div>

                      {/* Metadata */}
                      <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                        <div className="flex justify-between">
                          <span>
                            Saved:{" "}
                            {new Date(item.savedDate).toLocaleDateString()}
                          </span>
                          <span>
                            Min. order: {item.minimumOrder} {item.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
