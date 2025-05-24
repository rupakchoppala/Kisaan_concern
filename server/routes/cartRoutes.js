import express from 'express';
import multer from 'multer';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import  protect  from '../middleware/authMiddleware.js'; // Ensure user is authenticated
import { addToFertiCart,updateFertiCartItem,getFertiCart,removeFertiCartItem,clearFertiCart } from '../controllers/FerticartController.js';
const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/get_cart', protect, getCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove', protect, removeCartItem);
router.delete('/clear', protect, clearCart);
router.post('/ferti_add', protect, addToFertiCart);
router.get('/get_ferticart', protect, getFertiCart);
router.put('/update_ferticart', protect, updateFertiCartItem);
router.delete('/remove_ferticart', protect, removeFertiCartItem);
router.delete('/clear_ferticart', protect, clearFertiCart);
export default router;
