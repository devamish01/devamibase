import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ordersApi } from "../lib/api";
import {
  User,
  MapPin,
  Lock,
  Package,
  Calendar,
  Loader2,
  Edit,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  total: number;
  createdAt: string;
  items: Array<{
    product: {
      title: string;
      thumbnail: { url: string };
    };
    quantity: number;
  }>;
}

export default function Profile() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await ordersApi.getMyOrders({ limit: 10 });
        setOrders(response.orders);
      } catch (error: any) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Please Login</h1>
          <p className="text-slate-600">
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setProfileLoading(true);
      await updateProfile(profileData);
      setEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-davami-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900">
            My Profile
          </h1>
          <p className="mt-2 text-xl text-slate-600">
            Manage your account and view your orders
          </p>
          <div className="mt-4">
            <Badge className="bg-primary-100 text-primary-800 border-primary-200 text-lg px-4 py-2">
              {user?.role === "admin" ? "Administrator" : "Customer"}
            </Badge>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your profile information and address
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProfile(!editingProfile)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editingProfile ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          disabled={!editingProfile}
                          className="border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="border-slate-200 bg-slate-50"
                        />
                        <p className="text-xs text-slate-500">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!editingProfile}
                        className="border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900 flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Address</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={profileData.address.street}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                street: e.target.value,
                              },
                            }))
                          }
                          disabled={!editingProfile}
                          className="border-slate-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profileData.address.city}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address,
                                  city: e.target.value,
                                },
                              }))
                            }
                            disabled={!editingProfile}
                            className="border-slate-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={profileData.address.state}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address,
                                  state: e.target.value,
                                },
                              }))
                            }
                            disabled={!editingProfile}
                            className="border-slate-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={profileData.address.zipCode}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address,
                                  zipCode: e.target.value,
                                },
                              }))
                            }
                            disabled={!editingProfile}
                            className="border-slate-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={profileData.address.country}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                country: e.target.value,
                              },
                            }))
                          }
                          disabled={!editingProfile}
                          className="border-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  {editingProfile && (
                    <Button
                      type="submit"
                      disabled={profileLoading}
                      className="bg-davami-gradient hover:opacity-90 text-white border-0"
                    >
                      {profileLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order History</span>
                </CardTitle>
                <CardDescription>
                  View your recent orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      You haven't placed any orders yet. Start shopping to see
                      your orders here.
                    </p>
                    <Button className="bg-davami-gradient hover:opacity-90 text-white border-0">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-slate-900">
                              Order #{order.orderNumber}
                            </h4>
                            <p className="text-sm text-slate-500 flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={getStatusColor(order.orderStatus)}
                            >
                              {order.orderStatus.charAt(0).toUpperCase() +
                                order.orderStatus.slice(1)}
                            </Badge>
                            <p className="text-lg font-bold text-slate-900 mt-1">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {order.items.slice(0, 3).map((item, index) => (
                            <img
                              key={index}
                              src={item.product.thumbnail.url}
                              alt={item.product.title}
                              className="w-12 h-12 object-cover rounded border border-slate-200"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-xs text-slate-600">
                              +{order.items.length - 3}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-slate-600">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>
                  Change your password and manage security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Password Security
                    </h4>
                    <p className="text-sm text-blue-700">
                      Your password should be at least 6 characters long and
                      contain a mix of letters and numbers for better security.
                    </p>
                  </div>

                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="border-slate-200"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-davami-gradient hover:opacity-90 text-white border-0"
                    >
                      Update Password
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
