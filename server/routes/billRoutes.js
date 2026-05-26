import express from 'express';
import { generateMaintenanceBill, payMaintenanceBill, getBillsHistory } from '../controllers/billController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, authorizeRoles('Admin'), generateMaintenanceBill);
router.post('/pay', protect, payMaintenanceBill);
router.get('/history', protect, getBillsHistory);

export default router;
