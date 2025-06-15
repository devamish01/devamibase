import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ordersApi } from "../lib/api";
import {
  CheckCircle,
  Package,
  Truck,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight,
  Download,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    _id: string;
    product: {
      _id: string;
      title: string;
      images: { url: string }[];
      thumbnail: { url: string };
    };
    quantity: number;
    price: number;
    title: string;
  }>;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: string;
    transactionId: string;
    paymentStatus: string;
  };
  orderStatus: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  notes?: string;
}

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const response = await ordersApi.getById(orderId);
        setOrder(response);
      } catch (error: any) {
        console.error("Failed to fetch order:", error);
        toast.error("Order not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
          <p className="text-slate-600">
            The order you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-davami-gradient hover:opacity-90 text-white border-0">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
          <div className="inline-flex items-center space-x-4">
            <Badge className="bg-primary-100 text-primary-800 border-primary-200 text-lg px-4 py-2">
              Order #{order.orderNumber}
            </Badge>
            <Badge
              className={`text-lg px-4 py-2 ${getStatusColor(order.orderStatus)}`}
            >
              {order.orderStatus.charAt(0).toUpperCase() +
                order.orderStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Items</span>
              </CardTitle>
              <CardDescription>
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}{" "}
                ordered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-start space-x-3">
                  <img
                    src={item.product.thumbnail.url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Summary</span>
              </CardTitle>
              <CardDescription>
                Order placed on {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">
                    ${order.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? "Free" : `$${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Method</span>
                    <span className="font-medium capitalize">
                      {order.paymentInfo.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Status</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {order.paymentInfo.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Transaction ID</span>
                    <span className="font-mono text-xs">
                      {order.paymentInfo.transactionId}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Shipping Address</span>
            </CardTitle>
            <CardDescription>
              Your order will be delivered to this address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-slate-600">
                Email: {order.shippingAddress.email}
              </p>
              <p className="text-slate-600">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Here's what you can expect for your order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">
                    Confirmation Email
                  </h4>
                  <p className="text-sm text-slate-600">
                    You'll receive an email confirmation shortly
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Processing</h4>
                  <p className="text-sm text-slate-600">
                    We'll prepare your order for shipment
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Delivery</h4>
                  <p className="text-sm text-slate-600">
                    Track your package until it arrives
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Link to="/profile">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Order History
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full sm:w-auto bg-davami-gradient hover:opacity-90 text-white border-0">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
