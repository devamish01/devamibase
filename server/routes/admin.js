import express from "express";
import { body, validationResult, query } from "express-validator";
import { User, Product, Order, Contact } from "../models/index.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get dashboard statistics
router.get("/dashboard", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.find({ orderStatus: { $ne: "cancelled" } })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Product.find({
        isActive: true,
        inventory: { $lt: 5 },
      })
        .select("title inventory")
        .lean(),
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    // Get monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "cancelled" },
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      statistics: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenue,
        pendingOrders,
      },
      recentOrders,
      lowStockProducts,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching dashboard data" });
  }
});

// Get all users
router.get(
  "/users",
  authenticateToken,
  requireAdmin,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("role").optional().isIn(["user", "admin"]),
    query("search").optional().trim(),
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

      if (req.query.role) {
        filter.role = req.query.role;
      }

      if (req.query.search) {
        filter.$or = [
          { name: new RegExp(req.query.search, "i") },
          { email: new RegExp(req.query.search, "i") },
        ];
      }

      const [users, totalUsers] = await Promise.all([
        User.find(filter)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalUsers / limit);

      res.json({
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Server error while fetching users" });
    }
  },
);

// Update user status
router.put(
  "/users/:userId/status",
  authenticateToken,
  requireAdmin,
  [body("isActive").isBoolean().withMessage("isActive must be a boolean")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const { userId } = req.params;
      const { isActive } = req.body;

      // Prevent deactivating own account
      if (userId === req.user._id.toString()) {
        return res
          .status(400)
          .json({ message: "Cannot modify your own account status" });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true },
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        user,
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res
        .status(500)
        .json({ message: "Server error while updating user status" });
    }
  },
);

// Get all products for admin
router.get(
  "/products",
  authenticateToken,
  requireAdmin,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("category").optional().trim(),
    query("search").optional().trim(),
    query("includeInactive").optional().isBoolean(),
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

      // Include inactive products if requested
      if (!req.query.includeInactive) {
        filter.isActive = true;
      }

      if (req.query.category) {
        filter.category = new RegExp(req.query.category, "i");
      }

      if (req.query.search) {
        filter.$or = [
          { title: new RegExp(req.query.search, "i") },
          { description: new RegExp(req.query.search, "i") },
          { sku: new RegExp(req.query.search, "i") },
        ];
      }

      const [products, totalProducts] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalProducts / limit);

      res.json({
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get admin products error:", error);
      res.status(500).json({ message: "Server error while fetching products" });
    }
  },
);

// Contact/Inquiry management
router.get(
  "/contacts",
  authenticateToken,
  requireAdmin,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("status")
      .optional()
      .isIn(["new", "in_progress", "resolved", "closed"]),
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
        filter.status = req.query.status;
      }

      const [contacts, totalContacts] = await Promise.all([
        Contact.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Contact.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalContacts / limit);

      res.json({
        contacts,
        pagination: {
          currentPage: page,
          totalPages,
          totalContacts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Server error while fetching contacts" });
    }
  },
);

// Update contact status
router.put(
  "/contacts/:contactId/status",
  authenticateToken,
  requireAdmin,
  [
    body("status")
      .isIn(["new", "in_progress", "resolved", "closed"])
      .withMessage("Invalid status"),
    body("isRead").optional().isBoolean(),
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

      const { contactId } = req.params;
      const updateData = { status: req.body.status };

      if (req.body.isRead !== undefined) {
        updateData.isRead = req.body.isRead;
      }

      const contact = await Contact.findByIdAndUpdate(contactId, updateData, {
        new: true,
      });

      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      res.json({
        message: "Contact status updated successfully",
        contact,
      });
    } catch (error) {
      console.error("Update contact status error:", error);
      res
        .status(500)
        .json({ message: "Server error while updating contact status" });
    }
  },
);

// Create new admin user
router.post(
  "/create-admin",
  authenticateToken,
  requireAdmin,
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
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

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      // Create new admin user
      const adminUser = new User({
        name,
        email,
        password,
        role: "admin",
      });

      await adminUser.save();

      res.status(201).json({
        message: "Admin user created successfully",
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } catch (error) {
      console.error("Create admin error:", error);
      res
        .status(500)
        .json({ message: "Server error while creating admin user" });
    }
  },
);

// Bulk operations
router.post(
  "/bulk-operations",
  authenticateToken,
  requireAdmin,
  [
    body("operation")
      .isIn(["delete_products", "update_status", "export_data"])
      .withMessage("Invalid operation"),
    body("ids").isArray().withMessage("IDs must be an array"),
    body("data").optional().isObject(),
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

      const { operation, ids, data } = req.body;

      let result;

      switch (operation) {
        case "delete_products":
          result = await Product.updateMany(
            { _id: { $in: ids } },
            { isActive: false },
          );
          break;

        case "update_status":
          if (!data || !data.status) {
            return res
              .status(400)
              .json({ message: "Status is required for update operation" });
          }
          result = await Order.updateMany(
            { _id: { $in: ids } },
            { orderStatus: data.status },
          );
          break;

        default:
          return res.status(400).json({ message: "Operation not implemented" });
      }

      res.json({
        message: `Bulk ${operation} completed successfully`,
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Bulk operations error:", error);
      res.status(500).json({ message: "Server error during bulk operation" });
    }
  },
);

export default router;
