import express from 'express';
import { checkinVisitor, checkoutVisitor, getVisitorLogs } from '../controllers/visitorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getVisitorLogs);
router.post('/checkin', protect, authorizeRoles('Security'), checkinVisitor);
router.put('/checkout/:id', protect, authorizeRoles('Security', 'Admin'), checkoutVisitor);

export default router;
