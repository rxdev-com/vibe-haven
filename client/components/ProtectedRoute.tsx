import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EmailVerification from "./EmailVerification";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "vendor" | "supplier";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">Checking your authentication</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-specific access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard if user has wrong role
    const redirectPath =
      user?.role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // Check if email verification is required
  if (user && !user.emailVerified && !showEmailVerification) {
    return (
      <EmailVerification onVerified={() => setShowEmailVerification(false)} />
    );
  }

  return <>{children}</>;
}
