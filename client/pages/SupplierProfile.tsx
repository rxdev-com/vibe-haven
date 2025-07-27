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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import ImageUpload from "@/components/ImageUpload";
import ProfilePhoto from "@/components/ProfilePhoto";
import DeliveryMap from "@/components/DeliveryMap";
import NotificationPanel from "@/components/NotificationPanel";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  Star,
  Package,
  TrendingUp,
  Clock,
  Store,
  Truck,
  Users,
  BadgeCheck,
  Camera,
  Map,
  Navigation,
  Calendar,
  CreditCard,
  Plus,
  Trash2,
  Eye,
  Upload,
} from "lucide-react";

interface BusinessImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: "facility" | "equipment" | "certificates" | "team" | "products";
  isMain: boolean;
}

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  growth: number;
}

const mockSalesHistory: SalesData[] = [
  { month: "Jan 2024", revenue: 125000, orders: 45, growth: 12 },
  { month: "Feb 2024", revenue: 140000, orders: 52, growth: 15 },
  { month: "Mar 2024", revenue: 135000, orders: 48, growth: -3 },
  { month: "Apr 2024", revenue: 158000, orders: 61, growth: 17 },
  { month: "May 2024", revenue: 162000, orders: 65, growth: 3 },
];

export default function SupplierProfile() {
  const { addNotification } = useNotifications();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState("business-info");

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const [profileData, setProfileData] = useState({
    name: user?.name || "Kumar Singh",
    email: user?.email || "kumar@kumaroilmills.com",
    phone: "+91 87654 32109",
    businessName: user?.businessName || "Kumar Oil Mills",
    businessType: "Wholesale Distributor",
    address: "Industrial Area, Sector 62, Noida, Uttar Pradesh",
    description:
      "Leading supplier of premium quality oils and fats for the food industry. Serving Delhi NCR since 1998 with authentic and pure products.",
    established: "1998",
    license: "FSSAI-12345678901234",
    gstNumber: "09AABCU9603R1ZX",
    panNumber: "AABCU9603R",
    categories: ["Oils & Fats", "Spices", "Grains"],
    deliveryAreas: ["Delhi", "Noida", "Gurgaon", "Faridabad", "Greater Noida"],
    minOrderAmount: 500,
    deliveryCharges: 50,
    freeDeliveryAbove: 1000,
    businessHours: "9:00 AM - 6:00 PM",
    acceptingOrders: true,
    coordinates: { lat: 28.6139, lng: 77.2090 },
  });

  const [businessImages, setBusinessImages] = useState<BusinessImage[]>([
    {
      id: "1",
      url: "/api/placeholder/400/300",
      title: "Main Factory Building",
      description: "Our modern oil processing facility with state-of-the-art equipment",
      category: "facility",
      isMain: true,
    },
    {
      id: "2",
      url: "/api/placeholder/400/300",
      title: "Production Line",
      description: "Automated oil extraction and bottling machinery",
      category: "equipment",
      isMain: false,
    },
    {
      id: "3",
      url: "/api/placeholder/400/300",
      title: "Quality Control Lab",
      description: "In-house testing facility ensuring product quality",
      category: "facility",
      isMain: false,
    },
    {
      id: "4",
      url: "/api/placeholder/400/300",
      title: "FSSAI Certificate",
      description: "Food safety certification and compliance documents",
      category: "certificates",
      isMain: false,
    },
    {
      id: "5",
      url: "/api/placeholder/400/300",
      title: "Our Team",
      description: "Dedicated team of professionals ensuring quality service",
      category: "team",
      isMain: false,
    },
  ]);

  const [deliverySettings, setDeliverySettings] = useState({
    areas: profileData.deliveryAreas,
    minOrder: profileData.minOrderAmount,
    deliveryFee: profileData.deliveryCharges,
    freeDeliveryAbove: profileData.freeDeliveryAbove,
    maxDeliveryDistance: 25,
    estimatedDeliveryTime: "2-4 hours",
    operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  });

  const handleSave = () => {
    setIsEditing(false);
    addNotification({
      title: "Profile Updated",
      message: "Your supplier profile has been successfully updated",
      type: "success",
      icon: "✅",
    });
  };

  const handleToggleOrders = (accepting: boolean) => {
    setProfileData((prev) => ({ ...prev, acceptingOrders: accepting }));
    addNotification({
      title: accepting ? "Now Accepting Orders" : "Stopped Accepting Orders",
      message: accepting
        ? "Your store is now visible to vendors and accepting new orders"
        : "You've temporarily stopped accepting new orders",
      type: accepting ? "success" : "warning",
      icon: accepting ? "🟢" : "🔴",
    });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newImage: BusinessImage = {
              id: Date.now().toString(),
              url: e.target.result as string,
              title: file.name,
              description: "Business image",
              category: "facility",
              isMain: false,
            };
            setBusinessImages((prev) => [...prev, newImage]);
          }
        };
        reader.readAsDataURL(file);
      });
      
      addNotification({
        title: "Images Uploaded",
        message: "Business images have been added to your profile",
        type: "success",
        icon: "📸",
      });
    }
  };

  const removeImage = (imageId: string) => {
    setBusinessImages((prev) => prev.filter((img) => img.id !== imageId));
    addNotification({
      title: "Image Removed",
      message: "Image has been removed from your profile",
      type: "info",
      icon: "🗑️",
    });
  };

  const updateDeliverySettings = (key: string, value: any) => {
    setDeliverySettings((prev) => ({ ...prev, [key]: value }));
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
                Supplier Profile
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationPanel />
              <ProfilePhoto
                currentImage={profileImage}
                userName={user?.name || "User"}
                size="sm"
                onImageChange={(url) => setProfileImage(url)}
              />
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/supplier">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Supplier Profile</h1>
              <p className="text-gray-600">Manage your business information and settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={profileData.acceptingOrders}
                onCheckedChange={handleToggleOrders}
              />
              <span className="text-sm font-medium">
                {profileData.acceptingOrders ? "Accepting Orders" : "Orders Paused"}
              </span>
            </div>
            {isEditing ? (
              <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                  {profileData.businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profileData.businessName}</h2>
                <p className="text-gray-600 mb-2">{profileData.businessType}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profileData.address.split(",")[0]}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    4.8 Rating
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    186 Orders
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Since {profileData.established}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={profileData.acceptingOrders ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {profileData.acceptingOrders ? "🟢 Active" : "🔴 Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="business-info">Business Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="delivery-settings">Delivery Settings</TabsTrigger>
            <TabsTrigger value="sales-history">Sales History</TabsTrigger>
          </TabsList>

          {/* Business Info Tab */}
          <TabsContent value="business-info" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your business details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={profileData.businessName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={profileData.businessType}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, businessType: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wholesale Distributor">Wholesale Distributor</SelectItem>
                        <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="Retailer">Retailer</SelectItem>
                        <SelectItem value="Trader">Trader</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal Information</CardTitle>
                  <CardDescription>Business licenses and certifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={profileData.gstNumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gstNumber: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={profileData.panNumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, panNumber: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">FSSAI License</Label>
                    <Input
                      id="license"
                      value={profileData.license}
                      onChange={(e) => setProfileData(prev => ({ ...prev, license: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="established">Established Year</Label>
                    <Input
                      id="established"
                      value={profileData.established}
                      onChange={(e) => setProfileData(prev => ({ ...prev, established: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Address & Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      value={profileData.description}
                      onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Business Images</CardTitle>
                    <CardDescription>Upload photos of your facility, products, and certificates</CardDescription>
                  </div>
                  <Button onClick={() => document.getElementById('image-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businessImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        {image.isMain && (
                          <Badge className="bg-blue-500">Main</Badge>
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium text-sm">{image.title}</h4>
                        <p className="text-xs text-gray-500">{image.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Settings Tab */}
          <TabsContent value="delivery-settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Configuration</CardTitle>
                  <CardDescription>Set your delivery zones and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Order Amount (₹)</Label>
                    <Input
                      type="number"
                      value={deliverySettings.minOrder}
                      onChange={(e) => updateDeliverySettings('minOrder', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Fee (₹)</Label>
                    <Input
                      type="number"
                      value={deliverySettings.deliveryFee}
                      onChange={(e) => updateDeliverySettings('deliveryFee', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Free Delivery Above (₹)</Label>
                    <Input
                      type="number"
                      value={deliverySettings.freeDeliveryAbove}
                      onChange={(e) => updateDeliverySettings('freeDeliveryAbove', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Delivery Distance (km)</Label>
                    <Input
                      type="number"
                      value={deliverySettings.maxDeliveryDistance}
                      onChange={(e) => updateDeliverySettings('maxDeliveryDistance', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Delivery Time</Label>
                    <Select
                      value={deliverySettings.estimatedDeliveryTime}
                      onValueChange={(value) => updateDeliverySettings('estimatedDeliveryTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                        <SelectItem value="2-4 hours">2-4 hours</SelectItem>
                        <SelectItem value="4-6 hours">4-6 hours</SelectItem>
                        <SelectItem value="Same day">Same day</SelectItem>
                        <SelectItem value="Next day">Next day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Areas</CardTitle>
                  <CardDescription>Manage your service areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deliverySettings.areas.map((area, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{area}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const newAreas = deliverySettings.areas.filter((_, i) => i !== index);
                            updateDeliverySettings('areas', newAreas);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newArea = prompt("Enter new delivery area:");
                        if (newArea) {
                          updateDeliverySettings('areas', [...deliverySettings.areas, newArea]);
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Area
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Map */}
            <DeliveryMap />
          </TabsContent>

          {/* Sales History Tab */}
          <TabsContent value="sales-history" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹7,20,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">271</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Active Customers</p>
                      <p className="text-2xl font-bold text-gray-900">89</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Revenue and order trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSalesHistory.map((data) => (
                    <div key={data.month} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{data.month}</h4>
                        <p className="text-sm text-gray-500">{data.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{data.revenue.toLocaleString()}</p>
                        <div className={`text-sm flex items-center ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.growth >= 0 ? '↗' : '↘'} {Math.abs(data.growth)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
