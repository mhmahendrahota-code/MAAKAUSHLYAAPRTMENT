import express from 'express';
import { getFeatures, updateFeature } from '../controllers/settingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all features flags (publicly accessible)
router.get('/features', getFeatures);

// PUT update feature status by key (accessible by Admins only)
router.put('/features/:key', protect, authorizeRoles('Admin'), updateFeature);

export default router;
