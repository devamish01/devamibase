import express from "express";
import { body, validationResult, param, query } from "express-validator";
import { Product } from "../models/index.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all products with filtering and pagination
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("category").optional().trim(),
    query("search").optional().trim(),
    query("sortBy").optional().isIn(["price", "createdAt", "title"]),
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
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = { isActive: true };

      if (req.query.category) {
        filter.category = new RegExp(req.query.category, "i");
      }

      if (req.query.search) {
        filter.$or = [
          { title: new RegExp(req.query.search, "i") },
          { description: new RegExp(req.query.search, "i") },
          { technologies: { $in: [new RegExp(req.query.search, "i")] } },
        ];
      }

      // Build sort object
      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
      const sort = { [sortBy]: sortOrder };

      // Get products and total count
      const [products, totalProducts] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
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
      console.error("Get products error:", error);
      res.status(500).json({ message: "Server error while fetching products" });
    }
  },
);

// Get single product by ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const product = await Product.findOne({
        _id: req.params.id,
        isActive: true,
      }).lean();

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Server error while fetching product" });
    }
  },
);

// Get product categories
router.get("/data/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error while fetching categories" });
  }
});

// Create new product (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("features")
      .optional()
      .isArray()
      .withMessage("Features must be an array"),
    body("technologies")
      .optional()
      .isArray()
      .withMessage("Technologies must be an array"),
    body("inventory")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Inventory must be a non-negative integer"),
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

      const productData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        features: req.body.features || [],
        technologies: req.body.technologies || [],
        inventory: req.body.inventory || 1,
        inStock: req.body.inStock !== false,
        images: req.body.images || [],
        thumbnail: req.body.thumbnail || {},
      };

      const product = new Product(productData);
      await product.save();

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Server error while creating product" });
    }
  },
);

// Update product (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  [
    param("id").isMongoId().withMessage("Invalid product ID"),
    body("title").optional().trim().isLength({ min: 3 }),
    body("description").optional().trim().isLength({ min: 10 }),
    body("price").optional().isFloat({ min: 0 }),
    body("category").optional().trim().notEmpty(),
    body("features").optional().isArray(),
    body("technologies").optional().isArray(),
    body("inventory").optional().isInt({ min: 0 }),
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

      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Server error while updating product" });
    }
  },
);

// Delete product (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  [param("id").isMongoId().withMessage("Invalid product ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }

      // Soft delete - set isActive to false
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true },
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Server error while deleting product" });
    }
  },
);

export default router;
