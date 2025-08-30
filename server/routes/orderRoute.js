import express from 'express';
import mongoose from 'mongoose';
import protect from '../middleware/authMiddleware.js';
import ProductOrder from '../models/Product_orders.js';
import FertiCart from '../models/FertiCart.js';

const router = express.Router();

router.post('/placeOrder', protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    let { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products selected' });
    }

    products = products.map(id => new mongoose.Types.ObjectId(id));

    // Find user's cart document
    const cart = await FertiCart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter cart items matching selected products
    const matchingItems = cart.items.filter(item =>
      products.some(pid => pid.equals(item.productId._id))
    );

    if (matchingItems.length === 0) {
      return res.status(404).json({ message: 'No matching items in cart' });
    }

    // Prepare order items
    const orderItems = matchingItems.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.sale_price
        ? parseFloat(item.productId.sale_price.replace('Rs.', '').trim())
        : parseFloat(item.productId.original_price.replace('Rs.', '').trim()),
    }));

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const order = new ProductOrder({
      userId,
      items: orderItems,
      totalAmount,
      deliveryDate,
      status: 'pending',
    });

    await order.save();

    // Remove ordered items from the cart
    cart.items = cart.items.filter(
      item => !products.some(pid => pid.equals(item.productId._id))
    );

    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


export default router;
