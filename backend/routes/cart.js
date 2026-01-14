import express from "express";
import Cart from "../models/cart.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// Helper to get userId from token if exists
const getUserId = async (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;
    } catch (err) {
      return null;
    }
  }
  return null;
};

// Helper to find cart by user or sessionId
const getCartQuery = async (req) => {
  const userId = await getUserId(req);
  if (userId) return { user: userId };
  return { sessionId: req.headers["x-session-id"] };
};

// Get cart
router.get("/", async (req, res) => {
  try {
    const query = await getCartQuery(req);
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
    const userId = await getUserId(req);
    const sessionId = req.headers["x-session-id"];
    const query = userId ? { user: userId } : { sessionId };

    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({ ...query, items: [] });
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
    const query = await getCartQuery(req);

    const cart = await Cart.findOne(query);
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
    const query = await getCartQuery(req);

    const cart = await Cart.findOne(query);
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
    const query = await getCartQuery(req);
    const cart = await Cart.findOne(query);
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
  try {
    const userId = await getUserId(req);
    const { sessionId } = req.body;

    if (!userId || !sessionId) {
      return res.status(400).json({ message: "Missing userId or sessionId" });
    }

    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.status(200).json({ message: "Nothing to merge" });
    }

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    // Merge logic
    guestCart.items.forEach((gItem) => {
      const existingItem = userCart.items.find(
        (uItem) =>
          uItem.product.toString() === gItem.product.toString() &&
          uItem.size === gItem.size
      );
      if (existingItem) {
        existingItem.quantity += gItem.quantity;
      } else {
        userCart.items.push(gItem);
      }
    });

    await userCart.save();

    // Clear guest cart
    guestCart.items = [];
    await guestCart.save();

    res.status(200).json(userCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
