import express from 'express';
import Pesticide from '../models/Fertilizers.js';
import ProductOrder from '../models/Product_orders.js';
import protect from '../middleware/authMiddleware.js';
import FertiCart from '../models/FertiCart.js'; 
const router = express.Router();

// POST /api/checkout/buy_now
import crypto from "crypto";

router.post("/buy_now", protect, async (req, res) => {
  try {
    const { items, paymentInfo } = req.body;

    // Optional: Validate Razorpay signature
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentInfo;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const order = await ProductOrder.create({
      user: req.user._id,
      items,
      paymentInfo,
      status: "Paid",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation failed", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});
// router.post("/place_order",protect, async(req, res) => {
//   try {
//     const userId = req.user.id;
//     const { products } = req.body;
//     if (!products || products.length === 0) {
//       return res.status(400).json({ message: "No products selected" });
//     }

//     const cartItems = await FertiCart.find({
//       userId,
//       productId: { $in: products },
//     }).populate("productId");

//     if (!cartItems.length) {
//       return res.status(404).json({ message: "No matching items in cart" });
//     }

//     const orderItems = cartItems.map((item) => ({
//       productId: item.productId._id,
//       name: item.productId.name,
//       quantity: item.quantity,
//       price: item.productId.sale_price
//         ? parseFloat(item.productId.sale_price.replace("Rs.", "").trim())
//         : parseFloat(item.productId.original_price.replace("Rs.", "").trim()),
//     }));

//     const totalAmount = orderItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );

//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + 3);

//     const order = new ProductOrder({
//       userId,
//       items: orderItems,
//       totalAmount,
//       deliveryDate,
//     });

//     await order.save();

//     // Optional: Clear ordered items from cart
//     await FertiCart.deleteMany({ userId, productId: { $in: products } });

//     res.status(201).json({
//       message: "Order placed successfully",
//       orderId: order._id,
//     });
//   } catch (err) {
//     console.error("Error placing order:", err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

router.get('/get_orders',protect,async (req, res) => {
    try {
      const products = await ProductOrder.find() // populate only name & email
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get('get_order/:id',protect,async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductOrder.findById(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
