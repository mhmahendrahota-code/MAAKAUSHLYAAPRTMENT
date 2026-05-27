import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiters: max 5 attempts per 15 minutes
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerLimiter, registerUser);
router.post('/login', loginLimiter, loginUser);

export default router;
