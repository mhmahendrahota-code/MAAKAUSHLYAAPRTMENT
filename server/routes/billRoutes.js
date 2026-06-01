import express from 'express';
import { 
  generateMaintenanceBill, 
  payMaintenanceBill, 
  getBillsHistory,
  deleteMaintenanceBill,
  generateBulkMaintenanceBills
} from '../controllers/billController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, authorizeRoles('Admin', 'Committee'), generateMaintenanceBill);
router.post('/bulk-generate', protect, authorizeRoles('Admin', 'Committee'), generateBulkMaintenanceBills);
router.post('/pay', protect, payMaintenanceBill);
router.get('/history', protect, getBillsHistory);
router.delete('/delete/:id', protect, authorizeRoles('Admin', 'Committee'), deleteMaintenanceBill);

export default router;
