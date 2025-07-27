import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
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
import { ShoppingCart, Store, ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Redirect if already logged in
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/vendor/dashboard";
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (role: "vendor" | "supplier") => {
    if (!email || !password) {
      return;
    }

    const success = await login(email, password, role);
    if (success) {
      const redirectPath =
        role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard";
      window.location.href = redirectPath;
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
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Tabs defaultValue="vendor" className="w-full">
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
                <CardTitle>Vendor Login</CardTitle>
                <CardDescription>
                  Access your vendor dashboard to browse materials and manage
                  orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vendor-email">Email</Label>
                  <Input
                    id="vendor-email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vendor-password">Password</Label>
                  <Input
                    id="vendor-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                  onClick={() => handleLogin("vendor")}
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? "Signing in..." : "Sign in as Vendor"}
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
                <CardTitle>Supplier Login</CardTitle>
                <CardDescription>
                  Access your supplier dashboard to manage inventory and orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="supplier-email">Email</Label>
                  <Input
                    id="supplier-email"
                    type="email"
                    placeholder="supplier@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-password">Password</Label>
                  <Input
                    id="supplier-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  onClick={() => handleLogin("supplier")}
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? "Signing in..." : "Sign in as Supplier"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Demo Credentials
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>
              <strong>Vendor:</strong> vendor@example.com / vendor123
            </p>
            <p>
              <strong>Supplier:</strong> supplier@example.com / supplier123
            </p>
            <p>
              <strong>Demo:</strong> demo@jugadubazar.com / demo123
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-saffron-600 hover:text-saffron-700 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
