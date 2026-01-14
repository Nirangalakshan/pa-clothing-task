import express from "express";
import Cart from "../models/cart.js";

const router = express.Router();

// Get cart
router.get("/", async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    const userId = req.headers["authorization"] ? null : null; // Logic handled below

    let query = {};
    if (req.headers["authorization"]) {
      // Logic for authenticated user
      // Assuming middleware attaches user to req if present,
      // but for simplicity in this specific route before full middleware implementation:
      // Actually let's use a more robust way if we have the protect middleware.
    }

    // For now, let's keep it simple as implemented before
    if (req.headers["x-session-id"]) {
      query.sessionId = sessionId;
    }

    const cart = await Cart.findOne(query).populate("items.product");
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const sessionId = req.headers["x-session-id"];

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item quantity
router.put("/update", async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const sessionId = req.headers["x-session-id"];

    const cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
  try {
    const { productId, size } = req.body;
    const sessionId = req.headers["x-session-id"];

    const cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear cart
router.delete("/clear", async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    const cart = await Cart.findOne({ sessionId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Merge guest cart to user cart
router.post("/merge", async (req, res) => {
  // Basic merge logic for now
  res.status(200).json({ message: "Merged" });
});

export default router;
