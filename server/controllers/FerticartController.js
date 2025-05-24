import FarmerCart from '../models/FertiCart.js';
import Product from '../models/Product.js';

// Add item to cart
export const addToFertiCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  try {
    let cart = await FarmerCart.findOne({ userId });

    if (!cart) {
      // Create cart if it doesn't exist
      cart = new FarmerCart({ userId, items: [{ productId, quantity }] });
    } else {
      // Check if product already exists
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({
        message:"item added to the cart successfully",
        cart
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user cart
export const getFertiCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await FarmerCart.findOne({ userId }).populate('items.productId');
    res.status(200).json(cart || { userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update quantity
export const updateFertiCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await FarmerCart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item
export const removeFertiCartItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await FarmerCart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear cart (optional)
export const clearFertiCart = async (req, res) => {
  const userId = req.user._id;
  try {
    await FarmerCart.findOneAndDelete({ userId });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
