import express from "express";
import { body, validationResult, param, query } from "express-validator";
import { Order, Cart, Product, User } from "../models/index.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Create new order
router.post(
  "/",
  authenticateToken,
  [
    body("shippingAddress.name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),
    body("shippingAddress.email")
      .isEmail()
      .withMessage("Valid email is required"),
    body("shippingAddress.phone")
      .trim()
      .notEmpty()
      .withMessage("Phone is required"),
    body("shippingAddress.street")
      .trim()
      .notEmpty()
      .withMessage("Street address is required"),
    body("shippingAddress.city")
      .trim()
      .notEmpty()
      .withMessage("City is required"),
    body("shippingAddress.state")
      .trim()
      .notEmpty()
      .withMessage("State is required"),
    body("shippingAddress.zipCode")
      .trim()
      .notEmpty()
      .withMessage("ZIP code is required"),
    body("shippingAddress.country")
      .trim()
      .notEmpty()
      .withMessage("Country is required"),
    body("paymentInfo.method")
      .isIn(["card", "paypal", "bank_transfer"])
      .withMessage("Invalid payment method"),
    body("notes").optional().trim(),
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

      // Get user's cart
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
      );

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Validate inventory for all items
      for (const item of cart.items) {
        const product = await Product.findById(item.product._id);
        if (!product || !product.inStock || product.inventory < item.quantity) {
          return res.status(400).json({
            message: `Product "${item.product.title}" is not available or insufficient stock`,
          });
        }
      }

      // Calculate totals
      const subtotal = cart.totalAmount;
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
      const total = subtotal + tax + shipping;

      // Create order
      const order = new Order({
        user: req.user._id,
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          title: item.product.title,
        })),
        shippingAddress: req.body.shippingAddress,
        paymentInfo: {
          method: req.body.paymentInfo.method,
          paymentStatus: "pending",
        },
        subtotal,
        tax,
        shipping,
        total,
        notes: req.body.notes,
      });

      await order.save();

      // Update product inventory
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { inventory: -item.quantity },
        });
      }

      // Clear user's cart
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

      // Populate order for response
      const populatedOrder = await Order.findById(order._id)
        .populate("items.product", "title images thumbnail")
        .populate("user", "name email");

      res.status(201).json({
        message: "Order created successfully",
        order: populatedOrder,
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Server error while creating order" });
    }
  },
);

// Get user's orders
router.get(
  "/my-orders",
  authenticateToken,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 20 }),
    query("status")
      .optional()
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = { user: req.user._id };
      if (req.query.status) {
        filter.orderStatus = req.query.status;
      }

      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .populate("items.product", "title images thumbnail")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalOrders / limit);

      res.json({
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ message: "Server error while fetching orders" });
    }
  },
);

// Get single order
router.get(
  "/:id",
  authenticateToken,
  [param("id").isMongoId().withMessage("Invalid order ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const filter = { _id: req.params.id };

      // Regular users can only see their own orders
      if (req.user.role !== "admin") {
        filter.user = req.user._id;
      }

      const order = await Order.findOne(filter)
        .populate("items.product", "title images thumbnail")
        .populate("user", "name email")
        .lean();

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Server error while fetching order" });
    }
  },
);

// Cancel order (user can cancel if status is pending or confirmed)
router.put(
  "/:id/cancel",
  authenticateToken,
  [param("id").isMongoId().withMessage("Invalid order ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (!["pending", "confirmed"].includes(order.orderStatus)) {
        return res.status(400).json({
          message: "Order cannot be cancelled at this stage",
        });
      }

      // Update order status
      order.orderStatus = "cancelled";
      await order.save();

      // Restore product inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { inventory: item.quantity },
        });
      }

      res.json({
        message: "Order cancelled successfully",
        order,
      });
    } catch (error) {
      console.error("Cancel order error:", error);
      res.status(500).json({ message: "Server error while cancelling order" });
    }
  },
);

// Admin routes

// Get all orders (Admin only)
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("status")
      .optional()
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
    query("sortBy").optional().isIn(["createdAt", "total", "orderStatus"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.status) {
        filter.orderStatus = req.query.status;
      }

      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
      const sort = { [sortBy]: sortOrder };

      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .populate("items.product", "title images thumbnail")
          .populate("user", "name email")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalOrders / limit);

      res.json({
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get all orders error:", error);
      res.status(500).json({ message: "Server error while fetching orders" });
    }
  },
);

// Update order status (Admin only)
router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  [
    param("id").isMongoId().withMessage("Invalid order ID"),
    body("status")
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .withMessage("Invalid status"),
    body("trackingNumber").optional().trim(),
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

      const updateData = { orderStatus: req.body.status };

      if (req.body.trackingNumber) {
        updateData.trackingNumber = req.body.trackingNumber;
      }

      const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      })
        .populate("items.product", "title images thumbnail")
        .populate("user", "name email");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res
        .status(500)
        .json({ message: "Server error while updating order status" });
    }
  },
);

export default router;
