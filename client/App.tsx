import React from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import VendorProfile from "./pages/VendorProfile";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierInventory from "./pages/SupplierInventory";
import SupplierPendingOrders from "./pages/SupplierPendingOrders";
import OrderTracking from "./pages/OrderTracking";
import ActiveOrders from "./pages/ActiveOrders";
import InTransit from "./pages/InTransit";
import Rating from "./pages/Rating";
import SavedItems from "./pages/SavedItems";
import MaterialDetails from "./pages/MaterialDetails";
import Cart from "./pages/Cart";
import VendorMarketplace from "./pages/VendorMarketplace";
import VendorSellItems from "./pages/VendorSellItems";
import VendorActiveOrders from "./pages/VendorActiveOrders";
import OrderTrackingLive from "./pages/OrderTrackingLive";
import CartWithInstructions from "./pages/CartWithInstructions";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Vendor Routes */}
                <Route
                  path="/vendor/dashboard"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/profile"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/orders"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <OrderTracking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/active-orders"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorActiveOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/in-transit"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <InTransit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/rating"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <Rating />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/saved-items"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <SavedItems />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/material/:id"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <MaterialDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <CartWithInstructions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track-order/:orderId"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <OrderTrackingLive />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/marketplace"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorMarketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/sell-items"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorSellItems />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/my-listings"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <Placeholder
                        title="My Listings"
                        description="Manage your listed items and view buyer inquiries"
                        backTo="/vendor/dashboard"
                        backLabel="Back to Dashboard"
                      />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Supplier Routes */}
                <Route
                  path="/supplier/dashboard"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <SupplierDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <SupplierDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/profile"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <SupplierProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/inventory"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <SupplierInventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/pending-orders"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <SupplierPendingOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/revenue"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <Placeholder
                        title="Revenue Analytics"
                        description="View your monthly revenue and financial analytics"
                        backTo="/supplier/dashboard"
                        backLabel="Back to Dashboard"
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/completed-orders"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <Placeholder
                        title="Completed Orders"
                        description="View all your completed orders and delivery history"
                        backTo="/supplier/dashboard"
                        backLabel="Back to Dashboard"
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/analytics"
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <Placeholder
                        title="Analytics & Reports"
                        description="View detailed analytics and business reports"
                        backTo="/supplier/dashboard"
                        backLabel="Back to Dashboard"
                      />
                    </ProtectedRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
