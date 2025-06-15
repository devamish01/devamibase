import express from "express";
import Stripe from "stripe";
import { body, validationResult } from "express-validator";
import { Order, Cart } from "../models/index.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key");

// Create payment intent
router.post(
  "/create-intent",
  authenticateToken,
  [
    body("amount")
      .isFloat({ min: 0.5 })
      .withMessage("Amount must be at least $0.50"),
    body("currency")
      .optional()
      .isIn(["usd", "eur", "gbp"])
      .withMessage("Invalid currency"),
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

      const { amount, currency = "usd" } = req.body;

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId: req.user._id.toString(),
          userEmail: req.user.email,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("Create payment intent error:", error);
      res.status(500).json({
        message: "Error creating payment intent",
        error: error.message,
      });
    }
  },
);

// Confirm payment and create order
router.post(
  "/confirm",
  authenticateToken,
  [
    body("paymentIntentId")
      .notEmpty()
      .withMessage("Payment intent ID is required"),
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

      const { paymentIntentId, shippingAddress, notes } = req.body;

      // Verify payment intent
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: "Payment not successful",
          status: paymentIntent.status,
        });
      }

      // Get user's cart
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
      );

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Verify payment amount matches cart total
      const subtotal = cart.totalAmount;
      const tax = subtotal * 0.08;
      const shipping = subtotal > 100 ? 0 : 15;
      const total = subtotal + tax + shipping;

      if (Math.abs(paymentIntent.amount / 100 - total) > 0.01) {
        return res.status(400).json({
          message: "Payment amount does not match order total",
        });
      }

      // Create order
      const order = new Order({
        user: req.user._id,
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          title: item.product.title,
        })),
        shippingAddress,
        paymentInfo: {
          method: "card",
          transactionId: paymentIntent.id,
          paymentStatus: "completed",
        },
        orderStatus: "confirmed",
        subtotal,
        tax,
        shipping,
        total,
        notes: notes || "",
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

      res.json({
        message: "Payment confirmed and order created successfully",
        order: populatedOrder,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
        },
      });
    } catch (error) {
      console.error("Confirm payment error:", error);
      res.status(500).json({
        message: "Error confirming payment",
        error: error.message,
      });
    }
  },
);

// Get payment details
router.get("/intent/:paymentIntentId", authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Only return payment intent if it belongs to the current user
    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
    });
  } catch (error) {
    console.error("Get payment intent error:", error);
    res.status(500).json({
      message: "Error retrieving payment details",
      error: error.message,
    });
  }
});

// Webhook endpoint for Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("💰 Payment succeeded:", paymentIntent.id);

        // Update order payment status if exists
        await Order.findOneAndUpdate(
          { "paymentInfo.transactionId": paymentIntent.id },
          {
            "paymentInfo.paymentStatus": "completed",
            orderStatus: "confirmed",
          },
        );
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("❌ Payment failed:", failedPayment.id);

        // Update order payment status
        await Order.findOneAndUpdate(
          { "paymentInfo.transactionId": failedPayment.id },
          {
            "paymentInfo.paymentStatus": "failed",
            orderStatus: "cancelled",
          },
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  },
);

// Refund payment (Admin only)
router.post(
  "/refund",
  authenticateToken,
  requireAdmin,
  [
    body("paymentIntentId")
      .notEmpty()
      .withMessage("Payment intent ID is required"),
    body("amount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Amount must be positive"),
    body("reason").optional().trim(),
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

      const { paymentIntentId, amount, reason } = req.body;

      const refundData = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      if (reason) {
        refundData.reason = reason;
      }

      const refund = await stripe.refunds.create(refundData);

      // Update order payment status
      await Order.findOneAndUpdate(
        { "paymentInfo.transactionId": paymentIntentId },
        {
          "paymentInfo.paymentStatus": "refunded",
          orderStatus: "cancelled",
        },
      );

      res.json({
        message: "Refund processed successfully",
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status,
          reason: refund.reason,
        },
      });
    } catch (error) {
      console.error("Refund error:", error);
      res.status(500).json({
        message: "Error processing refund",
        error: error.message,
      });
    }
  },
);

export default router;
