// controllers/pesticideController.js
import Pesticide from '../models/Fertilizers.js';
export const getAllPesticides = async (req, res) => {
  try {
    const pesticides = await Pesticide.find();
    res.status(200).json(pesticides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getFertilizerById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Pesticide.findById(id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const rateFertilizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const product = await Pesticide.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.ratings.push(rating);

    // Calculate average rating
    const sum = product.ratings.reduce((acc, r) => acc + r, 0);
    const avg = sum / product.ratings.length;
    product.rating = avg;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const addFertilizerReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required." });
    }

    const product = await Pesticide.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Prevent duplicate reviews from the same user
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    const newReview = {
      user: req.user._id,
      name: req.user.userName,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(newReview);

    // Update average rating
    const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added", review: newReview });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
