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
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWhatsApp } from "@/lib/whatsapp";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  MessageSquare,
  MapPin,
  Package,
  Clock,
  User,
  Heart,
  Globe,
} from "lucide-react";

// Multi-language support
const translations = {
  en: {
    title: "Vendor Marketplace",
    subtitle: "Buy and sell unused items with other vendors",
    searchPlaceholder: "Search for items...",
    categories: {
      all: "All Categories",
      spices: "Spices",
      oils: "Oils & Fats", 
      grains: "Grains",
      equipment: "Equipment",
      packaging: "Packaging",
    },
    sortBy: "Sort by",
    price: "Price",
    condition: "Condition",
    location: "Location",
    seller: "Seller",
    contactSeller: "Contact Seller",
    addToWishlist: "Add to Wishlist",
    viewDetails: "View Details",
    priceRange: "Price Range",
    languages: {
      en: "English",
      hi: "हिंदी",
      ta: "தமிழ்",
    }
  },
  hi: {
    title: "विक्रेता बाज़ार",
    subtitle: "अन्य विक्रेताओं के साथ अनुपयोगी वस्तुओं को खरीदें और बेचें",
    searchPlaceholder: "वस्तुओं की खोज करें...",
    categories: {
      all: "सभी श्रेणियां",
      spices: "मसाले",
      oils: "तेल और वसा",
      grains: "अनाज",
      equipment: "उपकरण",
      packaging: "पैकेजिंग",
    },
    sortBy: "क्रमबद्ध करें",
    price: "मूल्य",
    condition: "स्थिति",
    location: "स्थान",
    seller: "विक्रेता",
    contactSeller: "विक्रेता से संपर्क करें",
    addToWishlist: "इच्छा सूची में जोड़ें",
    viewDetails: "विवरण देखें",
    priceRange: "मूल्य सीमा",
    languages: {
      en: "English",
      hi: "हिंदी", 
      ta: "தமிழ்",
    }
  },
  ta: {
    title: "விற்பனையாளர் சந்தை",
    subtitle: "மற்ற விற்பனையாளர்களுடன் பயன்படுத்தாத பொருட்களை வாங்கி விற்கவும்",
    searchPlaceholder: "பொருட்களைத் தேடுங்கள்...",
    categories: {
      all: "அனைத்து வகைகள்",
      spices: "மசாலாக்கள்",
      oils: "எண்ணெய் மற்றும் க���ழுப்புகள்",
      grains: "தானியங்கள்",
      equipment: "உபகரணங்கள்",
      packaging: "பேக்கேஜிங்",
    },
    sortBy: "வரிசைப்படுத்து",
    price: "விலை",
    condition: "நிலை",
    location: "இடம்",
    seller: "விற்பனையாளர்",
    contactSeller: "விற்பனையாளரைத் தொடர்பு கொள்ளுங்கள்",
    addToWishlist: "விருப்பப் பட்டியலில் சேர்க்கவும்",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    priceRange: "விலை வரம்பு",
    languages: {
      en: "English",
      hi: "हिंदी",
      ta: "தமிழ்",
    }
  }
};

// Mock vendor marketplace items
const mockVendorItems = [
  {
    id: "V001",
    title: "Commercial Rice Cooker - Barely Used",
    category: "equipment",
    price: 15000,
    originalPrice: 25000,
    condition: "Like New",
    description: "Professional rice cooker, bought 3 months ago but switching to gas cooking. Perfect condition.",
    seller: {
      name: "Sharma Snacks",
      location: "Karol Bagh, Delhi",
      phone: "+91 98765 43210",
      rating: 4.8,
      image: "S"
    },
    images: ["rice-cooker.jpg"],
    postedDate: "2024-01-10",
    urgency: "normal",
    tags: ["equipment", "commercial", "rice", "cooking"]
  },
  {
    id: "V002", 
    title: "Premium Saffron - 100g Sealed Pack",
    category: "spices",
    price: 8000,
    originalPrice: 10000,
    condition: "New",
    description: "Imported saffron, sealed pack. Over-ordered for festival season. Expires in 2025.",
    seller: {
      name: "Delhi Spice Corner",
      location: "Chandni Chowk, Delhi",
      phone: "+91 87654 32109",
      rating: 4.9,
      image: "D"
    },
    images: ["saffron.jpg"],
    postedDate: "2024-01-12",
    urgency: "urgent",
    tags: ["saffron", "spices", "premium", "sealed"]
  },
  {
    id: "V003",
    title: "Food Grade Plastic Containers - 50 Units",
    category: "packaging",
    price: 2500,
    originalPrice: 4000,
    condition: "Good",
    description: "High-quality food storage containers. Changed packaging design, selling old stock.",
    seller: {
      name: "Mumbai Street Food Co",
      location: "Bandra, Mumbai", 
      phone: "+91 76543 21098",
      rating: 4.6,
      image: "M"
    },
    images: ["containers.jpg"],
    postedDate: "2024-01-08",
    urgency: "normal",
    tags: ["containers", "packaging", "food-grade", "bulk"]
  },
  {
    id: "V004",
    title: "Organic Turmeric Powder - 25kg",
    category: "spices",
    price: 3500,
    originalPrice: 4500,
    condition: "Excellent",
    description: "Premium organic turmeric powder. Bulk quantity available. Best before Dec 2024.",
    seller: {
      name: "Rajesh's Kitchen",
      location: "Connaught Place, Delhi",
      phone: "+91 98765 43211",
      rating: 4.7,
      image: "R"
    },
    images: ["turmeric.jpg"],
    postedDate: "2024-01-14",
    urgency: "normal",
    tags: ["turmeric", "organic", "bulk", "spices"]
  }
];

export default function VendorMarketplace() {
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const { chatWithSupplier } = useWhatsApp();
  const [language, setLanguage] = useState<'en' | 'hi' | 'ta'>('en');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [profileImage, setProfileImage] = useState<string>("");
  const [likedItems, setLikedItems] = useState<string[]>([]);

  const t = translations[language];

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
    
    // Load saved language preference
    const savedLang = localStorage.getItem("preferred_language") as 'en' | 'hi' | 'ta';
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (newLang: 'en' | 'hi' | 'ta') => {
    setLanguage(newLang);
    localStorage.setItem("preferred_language", newLang);
    addNotification({
      title: "Language Changed",
      message: `Language switched to ${t.languages[newLang]}`,
      type: "success",
      icon: "🌐",
    });
  };

  const filteredItems = mockVendorItems
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "condition":
          return a.condition.localeCompare(b.condition);
        case "recent":
        default:
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
    });

  const handleContactSeller = (item: typeof mockVendorItems[0]) => {
    chatWithSupplier({
      supplierName: item.seller.name,
      supplierPhone: item.seller.phone,
      customMessage: `Hi! I'm interested in your "${item.title}" listed on JugaduBazar vendor marketplace for ₹${item.price}. Is it still available?`,
      vendorName: user?.name || "Vendor",
    });
  };

  const handleLikeItem = (itemId: string) => {
    const isLiked = likedItems.includes(itemId);
    if (isLiked) {
      setLikedItems(prev => prev.filter(id => id !== itemId));
    } else {
      setLikedItems(prev => [...prev, itemId]);
      addNotification({
        title: "Added to Wishlist",
        message: "Item saved to your wishlist",
        type: "success",
        icon: "❤️",
      });
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new": return "bg-green-100 text-green-700";
      case "like new": return "bg-emerald-100 text-emerald-700";
      case "excellent": return "bg-blue-100 text-blue-700";
      case "good": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
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
              <Badge className="bg-purple-100 text-purple-700">
                Vendor Marketplace
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t.languages.en}</SelectItem>
                  <SelectItem value="hi">{t.languages.hi}</SelectItem>
                  <SelectItem value="ta">{t.languages.ta}</SelectItem>
                </SelectContent>
              </Select>
              
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
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/vendor/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t.searchPlaceholder}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.categories.all}</SelectItem>
                <SelectItem value="spices">{t.categories.spices}</SelectItem>
                <SelectItem value="oils">{t.categories.oils}</SelectItem>
                <SelectItem value="grains">{t.categories.grains}</SelectItem>
                <SelectItem value="equipment">{t.categories.equipment}</SelectItem>
                <SelectItem value="packaging">{t.categories.packaging}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">{t.price}: Low to High</SelectItem>
                <SelectItem value="price-high">{t.price}: High to Low</SelectItem>
                <SelectItem value="condition">By {t.condition}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  {item.urgency === "urgent" && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      Urgent Sale
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-2"
                    onClick={() => handleLikeItem(item.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${likedItems.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <Badge className={getConditionColor(item.condition)}>
                    {item.condition}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Seller Info */}
                <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {item.seller.image}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.seller.name}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.seller.location}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-xs text-gray-600">{item.seller.rating}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(item.postedDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => handleContactSeller(item)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t.contactSeller}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t.viewDetails}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items found
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
