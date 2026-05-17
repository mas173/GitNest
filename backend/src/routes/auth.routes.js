import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';


const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

router.post('/register', validate(registerValidator), authLimiter, register);
router.post('/login', validate(loginValidator), authLimiter, login);
router.get('/me', protect, getMe);

export default router;
