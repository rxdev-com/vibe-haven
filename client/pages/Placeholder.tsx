import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  backTo?: string;
  backLabel?: string;
}

export default function Placeholder({ 
  title, 
  description, 
  backTo = "/", 
  backLabel = "Back to Home" 
}: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Back button */}
      <Link 
        to={backTo} 
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {backLabel}
      </Link>

      {/* Logo */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">JB</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
            JugaduBazar
          </span>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-saffron-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-saffron-600" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-gray-600">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              This page is coming soon! Continue prompting to help us build this feature.
            </p>
            <Link to={backTo}>
              <Button className="bg-gradient-to-r from-saffron-500 to-emerald-500 hover:from-saffron-600 hover:to-emerald-600">
                {backLabel}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
