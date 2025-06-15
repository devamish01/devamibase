import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Settings,
  Package,
  Users,
  BarChart3,
  FileText,
  Palette,
  Shield,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">
                Admin Panel
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-xl text-slate-600">
                Manage your products, orders, and website settings
              </p>
            </div>
            <Button className="bg-davami-gradient hover:opacity-90 text-white border-0">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +25% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Product Management</span>
              </CardTitle>
              <CardDescription>
                Add, edit, and manage your product catalog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button className="w-full justify-start bg-davami-gradient hover:opacity-90 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Existing Products
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Manage Categories
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Order Management</span>
              </CardTitle>
              <CardDescription>
                View and manage customer orders and inquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Customer Inquiries
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Sales Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Website Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Website Customization</span>
              </CardTitle>
              <CardDescription>
                Customize your website's appearance and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Change Theme & Colors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Homepage Content
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Site Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Access</span>
              </CardTitle>
              <CardDescription>
                Manage user access and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Activity Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-900">
                Admin Panel Implementation
              </h3>
              <p className="text-blue-700">
                This admin panel is a placeholder design. In a production
                environment, this would include:
              </p>
              <ul className="text-blue-700 text-sm space-y-1 ml-4 list-disc">
                <li>Authentication and authorization system</li>
                <li>Database integration for CRUD operations</li>
                <li>File upload functionality for product images</li>
                <li>Real-time analytics and reporting</li>
                <li>Email and notification management</li>
                <li>Security features and audit trails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
