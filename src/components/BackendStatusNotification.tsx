import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Server, AlertTriangle, CheckCircle } from "lucide-react";

export default function BackendStatusNotification() {
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/health", {
          method: "GET",
          timeout: 5000,
        } as any);

        if (response.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
          setShowNotification(true);
        }
      } catch (error) {
        setBackendStatus("offline");
        setShowNotification(true);
      }
    };

    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showNotification || backendStatus === "online") {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="space-y-2">
            <p className="font-medium">Backend Server Not Running</p>
            <p className="text-sm">
              The frontend is using demo data. To enable full functionality
              (cart, orders, admin), please start the backend server.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotification(false)}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                Dismiss
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/setup", "_blank")}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                Setup Guide
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
