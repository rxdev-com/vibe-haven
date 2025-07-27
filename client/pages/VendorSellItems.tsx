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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import {
  ArrowLeft,
  Plus,
  Camera,
  Tag,
  Package,
  DollarSign,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";

interface SellItemForm {
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  condition: string;
  description: string;
  urgency: string;
  tags: string;
}

const categories = [
  { value: "spices", label: "Spices & Seasonings" },
  { value: "oils", label: "Oils & Fats" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "equipment", label: "Kitchen Equipment" },
  { value: "packaging", label: "Packaging Materials" },
  { value: "utensils", label: "Utensils & Tools" },
  { value: "other", label: "Other Items" },
];

const conditions = [
  { value: "new", label: "Brand New", color: "bg-green-100 text-green-700" },
  { value: "like-new", label: "Like New", color: "bg-emerald-100 text-emerald-700" },
  { value: "excellent", label: "Excellent", color: "bg-blue-100 text-blue-700" },
  { value: "good", label: "Good", color: "bg-yellow-100 text-yellow-700" },
  { value: "fair", label: "Fair", color: "bg-orange-100 text-orange-700" },
];

export default function VendorSellItems() {
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<SellItemForm>({
    title: "",
    category: "",
    price: "",
    originalPrice: "",
    condition: "",
    description: "",
    urgency: "normal",
    tags: "",
  });

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleInputChange = (field: keyof SellItemForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.price || !formData.condition) {
      addNotification({
        title: "Missing Information",
        message: "Please fill in all required fields",
        type: "error",
        icon: "⚠️",
      });
      return;
    }

    // Mock submission
    addNotification({
      title: "Item Listed Successfully!",
      message: `"${formData.title}" has been posted to the vendor marketplace`,
      type: "success",
      icon: "✅",
    });

    // Reset form
    setFormData({
      title: "",
      category: "",
      price: "",
      originalPrice: "",
      condition: "",
      description: "",
      urgency: "normal",
      tags: "",
    });
    setImages([]);
  };

  const calculateSavings = () => {
    if (formData.price && formData.originalPrice) {
      const price = parseFloat(formData.price);
      const original = parseFloat(formData.originalPrice);
      if (original > price) {
        const savings = ((original - price) / original * 100).toFixed(0);
        return `${savings}% off`;
      }
    }
    return null;
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
                Sell Items
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/vendor/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">List Your Items</h1>
            <p className="text-gray-600">Sell unused items to other vendors in our marketplace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Provide essential details about your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Title *
                    </label>
                    <Input
                      placeholder="e.g., Commercial Rice Cooker - Barely Used"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition *
                      </label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleInputChange("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              <div className="flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${condition.color.split(' ')[0]}`} />
                                {condition.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe your item, its condition, why you're selling, etc."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing
                  </CardTitle>
                  <CardDescription>
                    Set competitive prices to attract buyers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price (₹) *
                      </label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (₹)
                      </label>
                      <Input
                        type="number"
                        placeholder="8000"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {calculateSavings() && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        🏷️ Great deal! Buyers save {calculateSavings()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Photos
                  </CardTitle>
                  <CardDescription>
                    Add photos to showcase your item (up to 5 images)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <div className="text-center">
                          <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <span className="text-xs text-gray-500">Add Photo</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          multiple
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      {images.length > 0 ? (
                        <img
                          src={images[0]}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {formData.title || "Item Title"}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {formData.condition && (
                          <Badge className={conditions.find(c => c.value === formData.condition)?.color}>
                            {conditions.find(c => c.value === formData.condition)?.label}
                          </Badge>
                        )}
                        {formData.category && (
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.value === formData.category)?.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {formData.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{parseInt(formData.price).toLocaleString()}
                        </span>
                        {calculateSavings() && (
                          <Badge className="bg-green-100 text-green-700">
                            {calculateSavings()}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency
                    </label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleInputChange("urgency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal Sale</SelectItem>
                        <SelectItem value="urgent">Urgent Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <Input
                      placeholder="commercial, bulk, sealed, etc."
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    List Item for Sale
                  </Button>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Listing Guidelines:</p>
                        <ul className="mt-1 text-xs space-y-1">
                          <li>• Be honest about item condition</li>
                          <li>• Include clear, well-lit photos</li>
                          <li>• Respond to inquiries promptly</li>
                          <li>• Price competitively</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
