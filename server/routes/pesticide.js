import express from "express";
//import { createProduct ,getAllProducts,getProductById} from "../controllers/productController.js";
import { getAllPesticides,getFertilizerById,rateFertilizer,addFertilizerReview } from "../controllers/fertilizerController.js";
import protect from "../middleware/authMiddleware.js";
const router=express.Router();
router.get('/all_fertilizers',protect,getAllPesticides)
router.get('/:id',protect,getFertilizerById);
router.put('/rate/:id',protect,rateFertilizer);
router.post('/review/:id',protect,addFertilizerReview);
export default router;