import Product from '../models/Product.js';
import multer from 'multer';
export const createProduct = async (req, res) => {
  try {
    console.log("Received product data:", req.body);
    console.log("Authenticated user:", req.user);

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    const { name, price, quantity, description, location, image, isOrganic } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      quantity,
      description,
      location,
      isOrganic,
      image,
      rating: 0,
      sellerName: req.user._id,  // make sure this exists
      userId: req.user._id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};


//fot image upload use multer dor multiform data
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // make sure this folder exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });
// Get all products with seller info populated
export const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().populate('sellerName', 'userName email'); // populate only name & email
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate('sellerName', 'userName email');
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export const rateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { rating } = req.body;
  
      const product = await Product.findById(id).populate('sellerName', 'userName email');
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
  //review the product
  // POST /api/products/review/:id
  export const addProductReview = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const productId = req.params.id;
  
      if (!rating || !comment) {
        return res.status(400).json({ message: "Rating and comment are required." });
      }
  
      const product = await Product.findById(productId);
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
  

  
  