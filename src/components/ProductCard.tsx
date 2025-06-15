import { Link } from "react-router-dom";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

interface Product {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  images: { url: string }[] | string[];
  thumbnail: { url: string } | string;
  features: string[];
  technologies: string[];
  category: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    const productId = product._id || product.id;
    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }

    try {
      await addToCart(productId);
    } catch (error) {
      // Error is already handled in the cart context
    }
  };

  // Handle different thumbnail formats
  const thumbnailUrl =
    typeof product.thumbnail === "string"
      ? product.thumbnail
      : product.thumbnail?.url || "";

  const productId = product._id || product.id;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-davami-lg transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src={thumbnailUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <Badge variant="secondary" className="bg-white/90 text-slate-900">
              {product.category}
            </Badge>
            <div className="flex items-center space-x-2">
              <Link to={`/product/${productId}`}>
                <Button
                  size="sm"
                  className="bg-white/90 text-slate-900 hover:bg-white border-0 shadow-lg"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="bg-davami-gradient hover:opacity-90 text-white border-0 shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stock Badge */}
        {product.inStock && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              In Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Rating */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
            ))}
            <span className="text-sm text-slate-500 ml-2">(4.8)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-3">
          {product.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1">
          {product.technologies.slice(0, 3).map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-xs border-slate-200 text-slate-600"
            >
              {tech}
            </Badge>
          ))}
          {product.technologies.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs border-slate-200 text-slate-600"
            >
              +{product.technologies.length - 3} more
            </Badge>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">
              ${product.price.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Starting from</div>
          </div>
          <Link to={`/product/${productId}`}>
            <Button
              variant="outline"
              size="sm"
              className="group-hover:bg-primary-50 group-hover:border-primary-200 group-hover:text-primary-700 transition-colors duration-200"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
