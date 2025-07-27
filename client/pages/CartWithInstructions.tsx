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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector, { useTranslation, SupportedLanguage } from "@/components/LanguageSelector";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  CreditCard,
  Package,
  AlertCircle,
  Info,
} from "lucide-react";

interface CartInstructions {
  supplierId: string;
  supplierName: string;
  instructions: string;
  deliveryPreference: string;
  urgency: string;
}

export default function CartWithInstructions() {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const { t } = useTranslation(language);
  const [profileImage, setProfileImage] = useState<string>("");
  const [supplierInstructions, setSupplierInstructions] = useState<CartInstructions[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);
    
    const savedLang = localStorage.getItem("preferred_language") as SupportedLanguage;
    if (savedLang) setLanguage(savedLang);

    // Group items by supplier and initialize instructions
    const suppliers = [...new Set(items.map(item => item.supplier))];
    const initialInstructions = suppliers.map(supplier => ({
      supplierId: supplier.replace(/\s+/g, '').toLowerCase(),
      supplierName: supplier,
      instructions: "",
      deliveryPreference: "standard",
      urgency: "normal"
    }));
    setSupplierInstructions(initialInstructions);
  }, [items]);

  const updateSupplierInstructions = (supplierId: string, field: string, value: string) => {
    setSupplierInstructions(prev => 
      prev.map(instruction => 
        instruction.supplierId === supplierId 
          ? { ...instruction, [field]: value }
          : instruction
      )
    );
  };

  const groupedItems = items.reduce((acc, item) => {
    const supplier = item.supplier;
    if (!acc[supplier]) {
      acc[supplier] = [];
    }
    acc[supplier].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleCheckout = () => {
    if (!deliveryAddress || !phoneNumber) {
      addNotification({
        title: "Missing Information",
        message: "Please provide delivery address and phone number",
        type: "error",
        icon: "⚠️",
      });
      return;
    }

    // Simulate order placement
    addNotification({
      title: "Order Placed Successfully!",
      message: `Order worth ₹${totalAmount} has been placed with ${Object.keys(groupedItems).length} supplier(s)`,
      type: "success",
      icon: "🎉",
    });

    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  const getDeliveryTime = (preference: string) => {
    switch (preference) {
      case "express": return "2-4 hours";
      case "standard": return "Same day";
      case "economy": return "1-2 days";
      default: return "Same day";
    }
  };

  const getDeliveryFee = (preference: string, subtotal: number) => {
    switch (preference) {
      case "express": return Math.max(100, subtotal * 0.1);
      case "standard": return subtotal > 1000 ? 0 : 50;
      case "economy": return 0;
      default: return subtotal > 1000 ? 0 : 50;
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
                Shopping Cart
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
              <NotificationPanel />
              <ProfilePhoto
                currentImage={profileImage}
                userName={user?.name || "User"}
                size="sm"
                onImageChange={(url) => setProfileImage(url)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/vendor/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{items.length} items • {Object.keys(groupedItems).length} suppliers</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Add some items to get started</p>
            <Link to="/vendor/dashboard">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedItems).map(([supplier, supplierItems]) => {
                const supplierInstr = supplierInstructions.find(s => s.supplierName === supplier);
                const subtotal = supplierItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                return (
                  <Card key={supplier}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          {supplier}
                        </CardTitle>
                        <Badge variant="outline">
                          {supplierItems.length} items
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Items */}
                      {supplierItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">{item.category}</p>
                              <p className="text-sm font-medium text-green-600">₹{item.price}/{item.unit}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-right min-w-20">
                              <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Supplier Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Instructions for {supplier}
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-800 mb-1">
                              Special Instructions
                            </label>
                            <Textarea
                              placeholder="Any special requirements, quality preferences, packaging instructions..."
                              value={supplierInstr?.instructions || ""}
                              onChange={(e) => updateSupplierInstructions(
                                supplier.replace(/\s+/g, '').toLowerCase(),
                                'instructions',
                                e.target.value
                              )}
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-blue-800 mb-1">
                                Delivery Preference
                              </label>
                              <select
                                className="w-full p-2 border rounded-md text-sm"
                                value={supplierInstr?.deliveryPreference || "standard"}
                                onChange={(e) => updateSupplierInstructions(
                                  supplier.replace(/\s+/g, '').toLowerCase(),
                                  'deliveryPreference',
                                  e.target.value
                                )}
                              >
                                <option value="economy">Economy (Free) - {getDeliveryTime("economy")}</option>
                                <option value="standard">Standard - {getDeliveryTime("standard")}</option>
                                <option value="express">Express (+₹{getDeliveryFee("express", subtotal)}) - {getDeliveryTime("express")}</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-blue-800 mb-1">
                                Urgency Level
                              </label>
                              <select
                                className="w-full p-2 border rounded-md text-sm"
                                value={supplierInstr?.urgency || "normal"}
                                onChange={(e) => updateSupplierInstructions(
                                  supplier.replace(/\s+/g, '').toLowerCase(),
                                  'urgency',
                                  e.target.value
                                )}
                              >
                                <option value="normal">Normal</option>
                                <option value="high">High Priority</option>
                                <option value="urgent">Urgent</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Supplier Subtotal */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Subtotal from {supplier}:</span>
                        <span className="text-lg font-bold text-green-600">₹{subtotal.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <Textarea
                      placeholder="Enter your complete delivery address..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number *
                    </label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fees:</span>
                    <span>₹{totalAmount > 1000 ? 0 : 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (GST):</span>
                    <span>₹{Math.round(totalAmount * 0.18)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ₹{(totalAmount + (totalAmount > 1000 ? 0 : 50) + Math.round(totalAmount * 0.18)).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium">Free Delivery!</p>
                        <p>Your order qualifies for free delivery as it's above ₹1000</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                    onClick={handleCheckout}
                    disabled={!deliveryAddress || !phoneNumber}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Secure payment powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
