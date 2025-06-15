import React, { createContext, useContext, useEffect, useState } from "react";
import { cartApi } from "../lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    images: { url: string }[];
    thumbnail: { url: string };
    inStock: boolean;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Calculate item count
  const itemCount = cart
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await cartApi.get();
      setCart(response);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const response = await cartApi.add(productId, quantity);
      setCart(response.cart);
      toast.success("Item added to cart!");
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      if (error.status === 0) {
        toast.error(
          "Please start the backend server to use cart functionality",
        );
      } else {
        toast.error(error.message || "Failed to add item to cart");
      }
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;

    try {
      const response = await cartApi.update(productId, quantity);
      setCart(response.cart);

      if (quantity === 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success("Cart updated");
      }
    } catch (error: any) {
      console.error("Failed to update cart:", error);
      toast.error(error.message || "Failed to update cart");
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await cartApi.remove(productId);
      setCart(response.cart);
      toast.success("Item removed from cart");
    } catch (error: any) {
      console.error("Failed to remove from cart:", error);
      toast.error(error.message || "Failed to remove item");
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await cartApi.clear();
      setCart(response.cart);
      toast.success("Cart cleared");
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      toast.error(error.message || "Failed to clear cart");
      throw error;
    }
  };

  const value: CartContextType = {
    cart,
    itemCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
