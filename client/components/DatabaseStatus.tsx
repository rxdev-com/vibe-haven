import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RefreshCw,
  Database,
  Wifi,
  WifiOff,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  testDatabaseConnection,
  type DatabaseTestResult,
} from "@/lib/databaseTest";

interface DatabaseStatusInfo {
  connected: boolean;
  message: string;
  timestamp: string;
  features: {
    authentication: boolean;
    materials: boolean;
    orders: boolean;
  };
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatusInfo | null>(null);
  const [testResults, setTestResults] = useState<DatabaseTestResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      // Run comprehensive database tests with additional safety
      const testResult = await testDatabaseConnection().catch((error) => {
        console.error("Database test completely failed:", error);
        return {
          isConnected: false,
          materialsCount: 0,
          usersCount: 0,
          ordersCount: 0,
          lastUpdated: new Date().toISOString(),
        };
      });
      setTestResults(testResult);

      // Use test results to determine status
      const isConnected = testResult.isConnected;
      const message = isConnected
        ? "JugaduBazar API is running with database connection!"
        : "JugaduBazar API is running in development mode";

      setStatus({
        connected: isConnected,
        message,
        timestamp: testResult.lastUpdated,
        features: {
          authentication: isConnected,
          materials: isConnected && testResult.materialsCount > 0,
          orders: isConnected,
        },
      });

      if (isConnected) {
        toast({
          title: "🎉 Database Connected!",
          description: `✅ Real-time data available! Found ${testResult.materialsCount} materials in database.`,
        });
      } else {
        toast({
          title: "Development Mode",
          description: "⚠️ Using mock data for development",
        });
      }
    } catch (error) {
      console.error("Database status check failed:", error);

      // Fallback status when everything fails
      setStatus({
        connected: false,
        message: "Unable to determine server status",
        timestamp: new Date().toISOString(),
        features: {
          authentication: false,
          materials: false,
          orders: false,
        },
      });

      toast({
        title: "Status Check Failed",
        description: "❌ Unable to check database status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Database Status</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Checking..." : "Refresh"}
        </Button>
      </div>

      {status && (
        <Alert
          className={
            status.connected
              ? "border-green-200 bg-green-50"
              : "border-yellow-200 bg-yellow-50"
          }
        >
          <div className="flex items-center space-x-2">
            {status.connected ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-yellow-600" />
            )}
            <Badge variant={status.connected ? "default" : "secondary"}>
              {status.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              <p className="font-medium">{status.message}</p>
              <p className="text-sm text-gray-600">
                Last checked: {new Date(status.timestamp).toLocaleString()}
              </p>

              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Available Features:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      status.features.authentication ? "default" : "secondary"
                    }
                  >
                    Authentication:{" "}
                    {status.features.authentication ? "Enabled" : "Mock"}
                  </Badge>
                  <Badge
                    variant={
                      status.features.materials ? "default" : "secondary"
                    }
                  >
                    Materials:{" "}
                    {status.features.materials ? "Live Data" : "Mock"}
                  </Badge>
                  <Badge
                    variant={status.features.orders ? "default" : "secondary"}
                  >
                    Orders: {status.features.orders ? "Live Data" : "Mock"}
                  </Badge>
                </div>

                {testResults && testResults.isConnected && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">
                      📊 Live Database Statistics:
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <Package className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                        <p className="text-lg font-bold text-blue-600">
                          {testResults.materialsCount}
                        </p>
                        <p className="text-xs text-gray-600">Materials</p>
                      </div>
                      <div>
                        <Users className="w-4 h-4 mx-auto mb-1 text-green-600" />
                        <p className="text-lg font-bold text-green-600">
                          {testResults.usersCount}
                        </p>
                        <p className="text-xs text-gray-600">Users</p>
                      </div>
                      <div>
                        <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                        <p className="text-lg font-bold text-purple-600">
                          {testResults.ordersCount}
                        </p>
                        <p className="text-xs text-gray-600">Orders</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
