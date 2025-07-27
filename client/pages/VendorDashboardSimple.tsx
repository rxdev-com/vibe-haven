import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockMaterials } from "@/lib/mockData";

export default function VendorDashboardSimple() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
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
              <Link to="/cart">
                <Button variant="ghost" size="sm">
                  Cart
                </Button>
              </Link>
              <Link to="/vendor/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Rajesh!
          </h1>
          <p className="text-gray-600">
            Find the best raw materials for your street food business
          </p>
        </div>

        {/* Development Mode Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <strong>Development Mode:</strong> Database not connected. Using
            mock data.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {material.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {material.supplier.businessName}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  ₹{material.price}
                </span>
                <span className="text-sm text-gray-500">{material.unit}</span>
              </div>
              <div className="mt-4">
                <Button className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600">
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
