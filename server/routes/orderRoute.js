import express from 'express';
import mongoose from 'mongoose';
import protect from '../middleware/authMiddleware.js';
import ProductOrder from '../models/Product_orders.js';
import Order from '../models/order.js';
import FertiCart from '../models/FertiCart.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
const router = express.Router();
router.post('/placeOrder', protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    let { products, paymentMethod } = req.body;
    if (!products || products.length === 0)
      return res.status(400).json({ message: 'No products selected' });
    products = products.map(id => new mongoose.Types.ObjectId(id));

    const cart = await FertiCart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const matchingItems = cart.items.filter(item =>
      products.some(pid => pid.equals(item.productId._id))
    );
    if (matchingItems.length === 0)
      return res.status(404).json({ message: 'No matching items in cart' });

    const orderItems = matchingItems.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.sale_price
        ? parseFloat(item.productId.sale_price.replace('Rs.', '').trim())
        : parseFloat(item.productId.original_price.replace('Rs.', '').trim()),
    }));

    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    // Get user address from DB
    const user = await User.findById(userId);
    const shippingAddress = user.address || {};

    const order = new ProductOrder({
      userId,
      items: orderItems,
      totalAmount,
      deliveryDate,
      status: paymentMethod === "COD" ? "pending" : "paid",
      shippingAddress, // ✅ include user address
      paymentInfo: {
        paymentMethod: paymentMethod || "COD",
        paymentStatus: paymentMethod === "COD" ? "pending" : "completed",
      },
    });
    await order.save();

    // Remove ordered items from cart
    cart.items = cart.items.filter(item => !products.some(pid => pid.equals(item.productId._id)));
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// GET /api/orders/myOrders
router.get('/myOrders', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate productId to get product details including image
    const orders = await ProductOrder.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name image'); // only select name and image

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders,
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

//for the consumer products
router.post('/place', protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    let { products, paymentMethod } = req.body;
    if (!products || products.length === 0)
      return res.status(400).json({ message: 'No products selected' });

    products = products.map(id => new mongoose.Types.ObjectId(id));

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const matchingItems = cart.items.filter(item =>
      products.some(pid => pid.equals(item.productId._id))
    );
    if (matchingItems.length === 0)
      return res.status(404).json({ message: 'No matching items in cart' });

    const orderItems = matchingItems.map(item => {
      const product = item.productId;
      let rawPrice = product.price || product.sale_price || product.original_price || "0";
      if (typeof rawPrice !== "string") rawPrice = String(rawPrice);
      const price = parseFloat(rawPrice.replace("Rs.", "").trim());
      return {
        productId: product._id,
        name: product.name || "Unknown Product",
        quantity: item.quantity || 1,
        price,
      };
    });

    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    // Get user address from DB
    const user = await User.findById(userId);
    const shippingAddress = user.address || {};

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      deliveryDate,
      status: paymentMethod === "COD" ? "pending" : "paid",
      shippingAddress, // ✅ include user address
      paymentInfo: {
        paymentMethod: paymentMethod || "COD",
        paymentStatus: paymentMethod === "COD" ? "pending" : "completed",
      },
    });

    await order.save();

    // Remove ordered items from cart
    cart.items = cart.items.filter(item => !products.some(pid => pid.equals(item.productId._id)));
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/myproductOrders', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all orders for this user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders,
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
router.put("/updateAddress/:orderId", protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shippingAddress } = req.body;

    // Find the order
    const order = await ProductOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent address change if shipped or cancelled
    if (["shipped", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot change address for this order" });
    }

    // Update address
    order.shippingAddress = shippingAddress;
    await order.save();

    res.status(200).json({ message: "Address updated successfully", order });
  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ message: "Server error" });
  }
}
)
//cancle order

router.put("/cancel/:orderId", protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    // Update status only if the order belongs to the user
    const order = await ProductOrder.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancelling pending or paid orders
    if (order.status === "shipped" || order.status === "cancelled") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.status = "cancelled";
    order.paymentInfo.paymentStatus = "failed"; // optional, mark payment as failed if COD/online
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});
export default router;
