import express from 'express';
import { loginOrSignUp } from '../controllers/user';

const router = express.Router();

// first api login
router.post("/login",loginOrSignUp)

export default router;