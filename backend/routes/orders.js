import express from "express";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import { protect } from "../middleware/auth.js";
import { sendOrderConfirmationEmail } from "../utils/email.js";

const router = express.Router();

// Create order (checkout)
router.post("/checkout", protect, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.user._id;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phone
    ) {
      return res
        .status(400)
        .json({ message: "Complete shipping address is required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total and prepare order items
    let totalPrice = 0;
    const orderItems = cart.items.map((item) => {
      const itemTotal = item.product.price * item.quantity;
      totalPrice += itemTotal;
      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        size: item.size,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      };
    });

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      orderDate: new Date(),
    });

    await order.save();

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(
        req.user.email,
        order,
        req.user.username
      );
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr.message);
      // Don't fail the order if email fails
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      orderDate: -1,
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure user can only view their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
