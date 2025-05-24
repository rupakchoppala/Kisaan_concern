import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,              // ✅ This is the field causing the error
  },
  name: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const pesticideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'pesticide',
  },
  image: {
    type: String,
  },
  sale_price: {
    type: String,
  },
  original_price: {
    type: String,
  },
  discount: {
    type: String,
  },
  reviews: [reviewSchema],
  ratings: {
    type: [Number],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  product_link: {
    type: String,
  },
  description: {
    type: String,
  }
}, {
  timestamps: true
});

export default mongoose.model('Pesticide', pesticideSchema);
