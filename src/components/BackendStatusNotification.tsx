import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Server, AlertTriangle, CheckCircle, X } from "lucide-react";

export default function BackendStatusNotification() {
  const [showNotification, setShowNotification] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  // Check if user has dismissed this notification in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem("backend-notification-dismissed");
    if (dismissed === "true") {
      setShowNotification(false);
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowNotification(false);
    setDismissed(true);
    sessionStorage.setItem("backend-notification-dismissed", "true");
  };

  const handleSetupGuide = () => {
    window.open("/setup", "_blank");
  };

  // Don't show if dismissed
  if (!showNotification || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md">
      <Alert className="border-blue-200 bg-blue-50 shadow-lg">
        <Server className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Demo Mode</p>
                <p className="text-sm">
                  You're viewing demo data. Enable the full eCommerce experience
                  by starting the backend server.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-blue-600 hover:bg-blue-100 h-6 w-6 p-0 -mt-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-blue-700 bg-blue-100 rounded p-2">
              <strong>Full features include:</strong>
              <br />
              • User authentication & cart
              <br />
              • Order processing & admin panel
              <br />• Real-time data persistence
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetupGuide}
                className="text-blue-700 border-blue-300 hover:bg-blue-100 text-xs"
              >
                Setup Guide
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="text-blue-700 border-blue-300 hover:bg-blue-100 text-xs"
              >
                Continue with Demo
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
