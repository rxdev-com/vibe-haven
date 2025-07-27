import React, { useState, useEffect } from "react";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Store, ArrowLeft } from "lucide-react";

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole =
    (searchParams.get("role") as "vendor" | "supplier") || "vendor";

  const [activeTab, setActiveTab] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    businessName: "",
    address: "",
    description: "",
  });
  const { register, isAuthenticated, isLoading } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  useEffect(() => {
    setActiveTab(initialRole);
  }, [initialRole]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async (role: "vendor" | "supplier") => {
    if (formData.password !== formData.confirmPassword) {
      // This should be a toast notification
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.businessName
    ) {
      return;
    }

    const success = await register({
      ...formData,
      role,
    });

    if (success) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">JB</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
              JugaduBazar
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join JugaduBazar
          </h1>
          <p className="text-gray-600">
            Create your account and start connecting
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "vendor" | "supplier")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="vendor" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Vendor</span>
            </TabsTrigger>
            <TabsTrigger
              value="supplier"
              className="flex items-center space-x-2"
            >
              <Store className="w-4 h-4" />
              <span>Supplier</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendor">
            <Card className="border-2 border-saffron-100">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Register as Vendor</CardTitle>
                <CardDescription>
                  Join as a street food vendor to source raw materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor-name">Full Name</Label>
                    <Input
                      id="vendor-name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendor-phone">Phone</Label>
                    <Input
                      id="vendor-phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="vendor-email">Email</Label>
                  <Input
                    id="vendor-email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vendor-business">Business Name</Label>
                  <Input
                    id="vendor-business"
                    placeholder="Your street food stall name"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="vendor-address">Address</Label>
                  <Textarea
                    id="vendor-address"
                    placeholder="Your stall location/address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor-password">Password</Label>
                    <Input
                      id="vendor-password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendor-confirm">Confirm</Label>
                    <Input
                      id="vendor-confirm"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                  onClick={() => handleRegister("vendor")}
                  disabled={
                    isLoading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    !formData.businessName
                  }
                >
                  {isLoading ? "Creating Account..." : "Register as Vendor"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplier">
            <Card className="border-2 border-emerald-100">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Register as Supplier</CardTitle>
                <CardDescription>
                  Join as a supplier to sell raw materials to vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier-name">Full Name</Label>
                    <Input
                      id="supplier-name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier-phone">Phone</Label>
                    <Input
                      id="supplier-phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supplier-email">Email</Label>
                  <Input
                    id="supplier-email"
                    type="email"
                    placeholder="supplier@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-business">Business Name</Label>
                  <Input
                    id="supplier-business"
                    placeholder="Your supply business name"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-address">Business Address</Label>
                  <Textarea
                    id="supplier-address"
                    placeholder="Your business location/warehouse address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-description">
                    Business Description
                  </Label>
                  <Textarea
                    id="supplier-description"
                    placeholder="Describe what materials you supply..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier-password">Password</Label>
                    <Input
                      id="supplier-password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier-confirm">Confirm</Label>
                    <Input
                      id="supplier-confirm"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  onClick={() => handleRegister("supplier")}
                  disabled={
                    isLoading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    !formData.businessName
                  }
                >
                  {isLoading ? "Creating Account..." : "Register as Supplier"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-saffron-600 hover:text-saffron-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
