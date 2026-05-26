import express from 'express';
import { 
  getHelplines, 
  addHelpline, 
  updateHelpline, 
  removeHelpline 
} from '../controllers/helplineController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Read helplines - accessible to all logged-in roles
router.get('/', protect, getHelplines);

// Manage helplines - Admin only
router.post('/', protect, authorizeRoles('Admin'), addHelpline);
router.put('/:id', protect, authorizeRoles('Admin'), updateHelpline);
router.delete('/:id', protect, authorizeRoles('Admin'), removeHelpline);

export default router;
