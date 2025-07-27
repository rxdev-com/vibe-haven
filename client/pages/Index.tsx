import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Store,
  Truck,
  Star,
  CheckCircle,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath =
        user.role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard";
      navigate(dashboardPath);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
                JugaduBazar
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-saffron-600"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-saffron-100 to-emerald-100 text-saffron-700 border-saffron-200">
              🚀 Revolutionizing Street Food Supply Chain
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect{" "}
              <span className="bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
                Street Food Vendors
              </span>{" "}
              with Local Suppliers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              JugaduBazar solves the raw material sourcing problem for Indian
              street food vendors. Get fresh ingredients, competitive prices,
              and reliable delivery - all in one platform.
            </p>

            {/* CTA Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-saffron-200">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron-50 to-orange-50 opacity-50"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-left">
                    I'm a Vendor
                  </CardTitle>
                  <CardDescription className="text-left text-gray-600">
                    Source raw materials from trusted local suppliers with
                    competitive prices and fast delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-2 text-left mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      Browse materials by category
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      Compare prices & ratings
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      Track order status in real-time
                    </li>
                  </ul>
                  <Link to="/register?role=vendor" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600">
                      Start as Vendor
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-200">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-50"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-left">
                    I'm a Supplier
                  </CardTitle>
                  <CardDescription className="text-left text-gray-600">
                    Sell your raw materials to local street food vendors and
                    grow your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-2 text-left mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      List your products easily
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      Manage orders efficiently
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      Build trusted reputation
                    </li>
                  </ul>
                  <Link to="/register?role=supplier" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                      Start as Supplier
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose JugaduBazar?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We understand the unique challenges of street food vendors and
              provide solutions that work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Local Network
              </h3>
              <p className="text-gray-600">
                Connect with suppliers in your area for faster delivery and
                better relationships.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Tracking
              </h3>
              <p className="text-gray-600">
                Track your orders from confirmation to delivery with live status
                updates.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Trusted Quality
              </h3>
              <p className="text-gray-600">
                Verified suppliers with ratings and reviews ensure you get
                quality materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-saffron-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-saffron-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Active Vendors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                200+
              </div>
              <div className="text-gray-600">Trusted Suppliers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-saffron-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">Orders Completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                ���2L+
              </div>
              <div className="text-gray-600">Money Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="text-xl font-bold">JugaduBazar</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 JugaduBazar. Empowering street food vendors across India.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
