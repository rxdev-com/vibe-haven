import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Package,
  ShoppingCart,
  Heart,
  Share2,
  MessageCircle,
  Truck,
  Shield,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";

interface Material {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  supplier: {
    id: string;
    name: string;
    businessName: string;
    location: string;
    phone: string;
    email: string;
    rating: number;
    totalReviews: number;
    verified: boolean;
    responseTime: string;
    avatar: string;
  };
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  minimumOrder: number;
  deliveryTime: string;
  specifications: {
    [key: string]: string;
  };
  tags: string[];
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }>;
  relatedProducts: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
  }>;
}

// Mock data for material details
const getMaterialDetails = (id: string): Material => ({
  id,
  name: "Premium Basmati Rice",
  category: "Grains & Cereals",
  price: 120,
  unit: "kg",
  description:
    "Premium quality long-grain basmati rice with excellent aroma and taste. Sourced directly from the finest farms in Punjab. Perfect for biryanis, pulavs, and daily cooking. Aged for optimal texture and fragrance.",
  supplier: {
    id: "supplier-1",
    name: "Rajesh Grain Merchants",
    businessName: "Grain Merchants",
    location: "Ghaziabad, Uttar Pradesh",
    phone: "+91 98765 43210",
    email: "contact@grainmerchants.com",
    rating: 4.8,
    totalReviews: 156,
    verified: true,
    responseTime: "Within 2 hours",
    avatar: "GM",
  },
  images: [
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
  ],
  inStock: true,
  stockQuantity: 500,
  minimumOrder: 5,
  deliveryTime: "1-2 days",
  specifications: {
    Grade: "Premium A+",
    Origin: "Punjab, India",
    "Grain Length": "6.5-7.5mm",
    Moisture: "12-13%",
    Purity: "98-99%",
    Packaging: "PP bags, customizable",
    "Shelf Life": "12 months",
  },
  tags: ["Premium", "Long Grain", "Aromatic", "Fresh", "Farm Direct"],
  reviews: [
    {
      id: "1",
      userName: "Priya Food Corner",
      rating: 5,
      comment:
        "Excellent quality rice! My customers love the aroma and taste. Consistent quality every time.",
      date: "2025-01-20",
      verified: true,
    },
    {
      id: "2",
      userName: "Delhi Biryani House",
      rating: 4,
      comment: "Good quality rice, perfect for biryanis. Delivery was on time.",
      date: "2025-01-18",
      verified: true,
    },
    {
      id: "3",
      userName: "Sharma Catering",
      rating: 5,
      comment:
        "Been ordering for 6 months now. Quality is consistent and price is reasonable.",
      date: "2025-01-15",
      verified: true,
    },
  ],
  relatedProducts: [
    {
      id: "2",
      name: "Organic Brown Rice",
      price: 95,
      unit: "kg",
      image: "/api/placeholder/150/150",
    },
    {
      id: "3",
      name: "Jasmine Rice",
      price: 110,
      unit: "kg",
      image: "/api/placeholder/150/150",
    },
    {
      id: "4",
      name: "Sona Masoori Rice",
      price: 85,
      unit: "kg",
      image: "/api/placeholder/150/150",
    },
  ],
});

export default function MaterialDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();
  const [material, setMaterial] = useState<Material | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(5);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      // Simulate API call
      const materialData = getMaterialDetails(id);
      setMaterial(materialData);
      setQuantity(materialData.minimumOrder);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!material) return;

    const cartItem = {
      id: material.id,
      name: material.name,
      price: material.price,
      unit: material.unit,
      supplier: material.supplier.businessName,
      supplierLocation: material.supplier.location,
      category: material.category,
      inStock: material.inStock,
      minimumOrder: material.minimumOrder,
    };

    addItem(cartItem, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} ${material.unit} of ${material.name} added to cart`,
    });
  };

  const handleSaveItem = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from Saved" : "Saved Successfully",
      description: isSaved
        ? `${material?.name} removed from saved items`
        : `${material?.name} added to saved items`,
    });
  };

  const handleWhatsAppChat = () => {
    if (!material) return;

    const message = `Hi! I'm interested in your ${material.name} (₹${material.price}/${material.unit}). Can you provide more details?`;
    const phoneNumber = material.supplier.phone.replace(/\D/g, ""); // Remove non-digits
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");

    toast({
      title: "Opening WhatsApp",
      description: `Starting chat with ${material.supplier.businessName}`,
    });
  };

  const handleCall = () => {
    if (!material) return;
    window.location.href = `tel:${material.supplier.phone}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: material?.name,
        text: `Check out this ${material?.name} on JugaduBazar`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">Fetching material details</p>
        </div>
      </div>
    );
  }

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
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-24 h-24" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {material.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-saffron-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="w-8 h-8" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{material.category}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveItem}
                  className={isSaved ? "text-red-500" : "text-gray-500"}
                >
                  <Heart
                    className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {material.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(Math.round(material.supplier.rating))}
                  <span className="text-sm text-gray-600 ml-1">
                    {material.supplier.rating} ({material.supplier.totalReviews}{" "}
                    reviews)
                  </span>
                </div>
                <Badge
                  className={
                    material.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {material.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                {material.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {material.description}
              </p>
            </div>

            {/* Price and Quantity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{material.price}
                  </span>
                  <span className="text-lg text-gray-600">
                    /{material.unit}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Available: {material.stockQuantity} {material.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    Min. order: {material.minimumOrder} {material.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.max(material.minimumOrder, quantity - 1))
                    }
                    disabled={quantity <= material.minimumOrder}
                  >
                    -
                  </Button>
                  <span className="w-16 text-center py-2 border border-gray-300 rounded">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(
                        Math.min(material.stockQuantity, quantity + 1),
                      )
                    }
                    disabled={quantity >= material.stockQuantity}
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-600">{material.unit}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!material.inStock || isInCart(material.id)}
                  className="bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isInCart(material.id) ? "In Cart" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWhatsAppChat}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-1" />
                  Delivery: {material.deliveryTime}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-1" />
                  Quality Assured
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold">
                    {material.supplier.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {material.supplier.businessName}
                    </h3>
                    {material.supplier.verified && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600">{material.supplier.name}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {material.supplier.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Responds {material.supplier.responseTime}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleCall}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsAppChat}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(material.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              {material.reviews.length} reviews from verified buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {material.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {review.userName}
                      </span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-1 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Products */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Related Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {material.relatedProducts.map((product) => (
                <Link key={product.id} to={`/material/${product.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-saffron-600 font-semibold">
                        ₹{product.price}/{product.unit}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
