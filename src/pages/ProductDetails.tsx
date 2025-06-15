import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import ProductCarousel from "../components/ProductCarousel";
import { productsApi } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await productsApi.getById(id);
        setProduct(response);
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!product) return;

    try {
      await addToCart(product._id);
    } catch (error) {
      // Error is already handled in the cart context
    }
  };

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Product not found
          </h1>
          <p className="text-slate-600">
            The product you're looking for doesn't exist.
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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              to="/#products"
              className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              Products
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <ProductCarousel
              images={product.images.map((img: any) => img.url)}
              title={product.title}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge className="bg-primary-100 text-primary-800 border-primary-200">
                  {product.category}
                </Badge>
                {product.inStock && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    In Stock
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-slate-600">(4.8 out of 5)</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">127 reviews</span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="text-4xl font-bold text-slate-900">
                  ${product.price.toLocaleString()}
                </div>
                <p className="text-slate-600">
                  Starting price for custom implementation
                </p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Key Features
              </h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-6">
              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 bg-davami-gradient hover:opacity-90 text-white border-0 px-8 py-4 text-lg font-semibold shadow-davami-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center justify-center space-x-6 pt-4 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Save to Wishlist
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Product
                </Button>
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-slate-900">
                Need More Information?
              </h4>
              <p className="text-sm text-slate-600">
                Our team is ready to discuss your specific requirements and
                provide a custom quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
