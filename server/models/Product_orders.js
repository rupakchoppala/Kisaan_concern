import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User model
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },

  // Optional shipping address
  shippingAddress: {
    fullName: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
  },

  // Optional payment details (you can expand this as needed)
  paymentInfo: {
    paymentMethod: { type: String }, // e.g., "Credit Card", "UPI", "Cash on Delivery"
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: { type: String },
  },

  // Estimated or actual delivery date
  deliveryDate: { type: Date },
});
const ProductOrder = mongoose.model('ProductOrder', orderSchema);
export default ProductOrder;
