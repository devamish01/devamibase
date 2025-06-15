import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  Terminal,
  Server,
  Database,
  CheckCircle,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function Setup() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-4">
            Setup Guide
          </Badge>
          <h1 className="text-4xl font-display font-bold text-slate-900">
            Davami Backend Setup
          </h1>
          <p className="mt-2 text-xl text-slate-600">
            Get the full eCommerce experience by starting the backend server
          </p>
        </div>

        {/* Current Status */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Server className="h-5 w-5" />
              <span>Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-yellow-700">Frontend:</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">Running</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-yellow-700">Backend:</span>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <span className="text-red-700">Not Running</span>
                </div>
              </div>
              <Separator className="bg-yellow-200" />
              <p className="text-sm text-yellow-700">
                The frontend is currently using demo data. Start the backend to
                enable:
                <br />• User authentication & cart functionality
                <br />• Order processing & admin panel
                <br />• Real-time data & full eCommerce features
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <span>Open Terminal in Backend Directory</span>
              </CardTitle>
              <CardDescription>
                Navigate to the server directory in a new terminal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span>cd server</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("cd server")}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span>Install Dependencies</span>
              </CardTitle>
              <CardDescription>
                Install all required Node.js packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span>npm install</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("npm install")}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span>Setup Environment</span>
              </CardTitle>
              <CardDescription>
                Create environment configuration file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span>cp .env.example .env</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("cp .env.example .env")}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                The default configuration will work for development. The backend
                will use an in-memory database.
              </p>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <span>Seed Sample Data</span>
              </CardTitle>
              <CardDescription>
                Load the database with products and admin user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span>npm run seed</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("npm run seed")}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">
                  Default Admin Credentials:
                </h4>
                <div className="space-y-1 text-sm text-green-700">
                  <p>
                    <strong>Email:</strong> admin@davami.com
                  </p>
                  <p>
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <span>Start Backend Server</span>
              </CardTitle>
              <CardDescription>
                Launch the API server on port 5000
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span>npm run dev</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("npm run dev")}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Success!</strong> When you see "✅ Connected to
                  in-memory MongoDB" and "🚀 Server running on port 5000", the
                  backend is ready!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Enabled */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Features Enabled After Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">User Features:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• User registration and login</li>
                  <li>• Shopping cart functionality</li>
                  <li>• Order processing and history</li>
                  <li>• Profile management</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Admin Features:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Product management (CRUD)</li>
                  <li>• Order management</li>
                  <li>• User administration</li>
                  <li>• Analytics dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">
                Common Issues:
              </h4>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <strong>Port 5000 already in use:</strong>
                  <br />
                  Change the PORT in server/.env file to a different port (e.g.,
                  PORT=5001)
                </div>
                <div>
                  <strong>npm command not found:</strong>
                  <br />
                  Make sure Node.js is installed:{" "}
                  <a
                    href="https://nodejs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download Node.js
                  </a>
                </div>
                <div>
                  <strong>Permission errors:</strong>
                  <br />
                  Try running commands with sudo (macOS/Linux) or run terminal
                  as administrator (Windows)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="px-6"
          >
            Refresh Page
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-davami-gradient hover:opacity-90 text-white border-0 px-6"
          >
            Back to Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
