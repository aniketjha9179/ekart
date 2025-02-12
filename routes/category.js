import express from 'express';
import { getAllCategories } from '../controllers/category.js';

const router = express.Router();

// first api login
router.get("/",getAllCategories)

export default router;