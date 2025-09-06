import Razorpay from "razorpay";
import crypto from "crypto";
import protect from "../middleware/authMiddleware.js";
import ProductOrder from "../models/Product_orders.js";
import router from "./auth.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay Order
router.post("/createRazorpayOrder", protect, async (req, res) => {
    try {
      const { products } = req.body;
  
      if (!products || products.length === 0) {
        return res.status(400).json({ message: "No products selected" });
      }
  
      // Calculate total amount in rupees
      const totalAmount = products.reduce((acc, p) => {
        const price = parseFloat(p.price); // price per item
        return acc + price * p.quantity;
      }, 0);
  
      if (!totalAmount || totalAmount <= 0) {
        return res.status(400).json({ message: "Total amount is invalid" });
      }
  
      const order = await razorpay.orders.create({
        amount: totalAmount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      });
  
      res.json(order);
    } catch (error) {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({ message: "Failed to create Razorpay order" });
    }
  });
  

// 2. Verify Payment
router.post("/verifyPayment", protect, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products } = req.body;
  
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products data is required" });
    }
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
  
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }
  
    try {
        const orderItems = products.map(p => ({
            productId: p.productId,
            name: p.name,
            quantity: p.quantity,
            price: p.price,
          }));
          
  
      const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
  
      const order = new ProductOrder({
        userId: req.user._id,
        items: orderItems,
        totalAmount,
        deliveryDate,
        status: "paid",
        paymentInfo: {
          paymentMethod: "Online",
          paymentStatus: "completed",
          transactionId: razorpay_payment_id,
        },
      });
  
      await order.save();
      res.json({ success: true, orderId: order._id });
    } catch (err) {
      console.error("Order save error:", err);
      res.status(500).json({ message: "Failed to save order" });
    }
  });
  
export default router;