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


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    reviews: [reviewSchema],
    quantity: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String, // You might store a URL/path to the image
    },
    ratings: {
      type: [Number],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    sellerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
        required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your user model is named 'User'
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
