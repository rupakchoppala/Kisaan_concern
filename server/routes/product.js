import express from "express";
import { createProduct ,getAllProducts,getProductById, rateProduct,addProductReview} from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js";
const router=express.Router();
router.post('/upload_product',protect,createProduct);
router.get('/all_products',protect,getAllProducts)
router.get('/:id',protect,getProductById);
router.put('/rate/:id',protect,rateProduct);
router.post('/review/:id', protect, addProductReview);
export default router;