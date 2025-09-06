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
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phoneNumber: String,
  },
  paymentInfo: {
    paymentMethod: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: String,
  },
  deliveryDate: { type: Date },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
