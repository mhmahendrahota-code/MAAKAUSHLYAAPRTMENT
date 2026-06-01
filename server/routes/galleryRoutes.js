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

// Manage events feed - Admin and Committee
router.post('/', protect, authorizeRoles('Admin', 'Committee'), addGalleryEvent);
router.put('/:id', protect, authorizeRoles('Admin', 'Committee'), updateGalleryEvent);
router.delete('/:id', protect, authorizeRoles('Admin', 'Committee'), removeGalleryEvent);

export default router;
