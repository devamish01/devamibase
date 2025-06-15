import express from "express";
import { body, validationResult, param } from "express-validator";
import { Cart, Product } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get user's cart
router.get("/", authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "title price images thumbnail inStock")
      .lean();

    if (!cart) {
      cart = {
        user: req.user._id,
        items: [],
        totalAmount: 0,
      };
    }

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
});

// Add item to cart
router.post(
  "/add",
  authenticateToken,
  [
    body("productId").isMongoId().withMessage("Invalid product ID"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const { productId, quantity } = req.body;

      // Check if product exists and is in stock
      const product = await Product.findOne({
        _id: productId,
        isActive: true,
        inStock: true,
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found or out of stock" });
      }

      // Check inventory
      if (product.inventory < quantity) {
        return res.status(400).json({
          message: `Only ${product.inventory} items available in stock`,
        });
      }

      // Find or create cart
      let cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        cart = new Cart({
          user: req.user._id,
          items: [],
        });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId,
      );

      if (existingItemIndex > -1) {
        // Update quantity
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (product.inventory < newQuantity) {
          return res.status(400).json({
            message: `Only ${product.inventory} items available in stock`,
          });
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }

      await cart.save();

      // Populate and return updated cart
      cart = await Cart.findById(cart._id)
        .populate("items.product", "title price images thumbnail inStock")
        .lean();

      res.json({
        message: "Item added to cart successfully",
        cart,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ message: "Server error while adding to cart" });
    }
  },
);

// Update cart item quantity
router.put(
  "/update/:productId",
  authenticateToken,
  [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const { productId } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      if (quantity === 0) {
        // Remove item from cart
        cart.items = cart.items.filter(
          (item) => item.product.toString() !== productId,
        );
      } else {
        // Check product availability
        const product = await Product.findById(productId);
        if (!product || !product.inStock || product.inventory < quantity) {
          return res.status(400).json({
            message: "Product not available or insufficient stock",
          });
        }

        // Update quantity
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId,
        );

        if (itemIndex === -1) {
          return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price; // Update price in case it changed
      }

      await cart.save();

      // Populate and return updated cart
      const updatedCart = await Cart.findById(cart._id)
        .populate("items.product", "title price images thumbnail inStock")
        .lean();

      res.json({
        message: "Cart updated successfully",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({ message: "Server error while updating cart" });
    }
  },
);

// Remove item from cart
router.delete(
  "/remove/:productId",
  authenticateToken,
  [param("productId").isMongoId().withMessage("Invalid product ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const { productId } = req.params;

      const cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Remove item from cart
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
      );

      await cart.save();

      // Populate and return updated cart
      const updatedCart = await Cart.findById(cart._id)
        .populate("items.product", "title price images thumbnail inStock")
        .lean();

      res.json({
        message: "Item removed from cart successfully",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res
        .status(500)
        .json({ message: "Server error while removing from cart" });
    }
  },
);

// Clear entire cart
router.delete("/clear", authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: "Cart cleared successfully",
      cart: {
        user: req.user._id,
        items: [],
        totalAmount: 0,
      },
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error while clearing cart" });
  }
});

// Get cart item count
router.get("/count", authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const itemCount = cart
      ? cart.items.reduce((total, item) => total + item.quantity, 0)
      : 0;

    res.json({ itemCount });
  } catch (error) {
    console.error("Get cart count error:", error);
    res.status(500).json({ message: "Server error while fetching cart count" });
  }
});

export default router;
