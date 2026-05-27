import express from 'express';
import { 
  getGalleryEvents, 
  addGalleryEvent, 
  updateGalleryEvent, 
  removeGalleryEvent 
} from '../controllers/galleryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Read events feed - public access
router.get('/', getGalleryEvents);

// Manage events feed - Admin only
router.post('/', protect, authorizeRoles('Admin'), addGalleryEvent);
router.put('/:id', protect, authorizeRoles('Admin'), updateGalleryEvent);
router.delete('/:id', protect, authorizeRoles('Admin'), removeGalleryEvent);

export default router;
