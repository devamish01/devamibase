import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
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
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { paymentApi } from "../lib/api";
import {
  CreditCard,
  ShoppingBag,
  MapPin,
  User,
  Mail,
  Phone,
  Loader2,
  Lock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "United States",
  });
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }
  }, [isAuthenticated, cart, navigate]);

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect
  }

  // Calculate totals
  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const requiredFields = [
      "name",
      "email",
      "phone",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
    ];
    const missingFields = requiredFields.filter(
      (field) => !shippingData[field as keyof typeof shippingData],
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Create payment intent
      const paymentResponse = await paymentApi.createIntent(total);

      // For demo purposes, we'll simulate a successful payment
      // In production, you would use Stripe Elements or similar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Confirm payment and create order
      const orderResponse = await paymentApi.confirmPayment({
        paymentIntentId: paymentResponse.paymentIntentId,
        shippingAddress: shippingData,
        notes,
      });

      // Clear cart and navigate to success page
      await clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-success/${orderResponse.order._id}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary-100 text-primary-800 border-primary-200 mb-4">
            Secure Checkout
          </Badge>
          <h1 className="text-4xl font-display font-bold text-slate-900">
            Complete Your Order
          </h1>
          <p className="mt-2 text-xl text-slate-600">
            Review your items and enter shipping information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Shipping Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the address where you'd like your order delivered
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={shippingData.name}
                        onChange={handleInputChange}
                        required
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingData.email}
                        onChange={handleInputChange}
                        required
                        className="border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      required
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      name="street"
                      value={shippingData.street}
                      onChange={handleInputChange}
                      required
                      className="border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                        required
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingData.state}
                        onChange={handleInputChange}
                        required
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingData.country}
                      onChange={handleInputChange}
                      required
                      className="border-slate-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                  <CardDescription>
                    Choose how you'd like to pay for your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <CreditCard className="h-5 w-5 text-slate-400" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-slate-500">
                          Pay securely with your card
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Demo Notice */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Demo Mode</p>
                        <p>
                          This is a demonstration. No actual payment will be
                          processed.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                  <CardDescription>
                    Add any special instructions for your order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                    className="border-slate-200"
                  />
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex items-start space-x-3">
                      <img
                        src={item.product.thumbnail.url}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-slate-500">
                          Qty: {item.quantity} × ${item.price.toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `$${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-davami-gradient hover:opacity-90 text-white border-0 py-4 text-lg font-semibold shadow-davami-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                <div className="text-xs text-center text-slate-500">
                  <p>Your payment information is secure and encrypted.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
