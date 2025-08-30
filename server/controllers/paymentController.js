import Razorpay from "razorpay";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create", async (req, res) => {
  const { items } = req.body;

  const totalAmount = items.reduce((sum, item) => {
    return sum + item.quantity *item.sale_price; // Replace 100 with your actual pricing logic
  }, 0);

  const options = {
    amount: totalAmount * 100, // amount in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating Razorpay order", err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

export default router;
