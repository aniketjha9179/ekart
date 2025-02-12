import express from 'express';
import { getProductsByCategoryId } from '../controllers/product.js';


const router = express.Router();

// first api login
router.get("/:categoryId",getProductsByCategoryId)

export default router;