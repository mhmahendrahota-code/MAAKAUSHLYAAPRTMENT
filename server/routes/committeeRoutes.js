import express from 'express';
import { 
  getCommittee, 
  addCommitteeMember, 
  updateCommitteeMember, 
  removeCommitteeMember 
} from '../controllers/committeeController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get committee - readable by all authenticated members
router.get('/', protect, getCommittee);

// Modify committee - Admin only operations
router.post('/', protect, authorizeRoles('Admin'), addCommitteeMember);
router.put('/:id', protect, authorizeRoles('Admin'), updateCommitteeMember);
router.delete('/:id', protect, authorizeRoles('Admin'), removeCommitteeMember);

export default router;
