import express from 'express';
import { getUserProfile, getSocietyDirectory, updateUser, deleteUser, getBachelorAlerts, updateBachelorStatus } from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/directory', protect, getSocietyDirectory);
router.put('/update', protect, authorizeRoles('Admin'), updateUser);
router.delete('/delete/:id', protect, authorizeRoles('Admin'), deleteUser);

// Bachelor Tenant Routes
router.get('/bachelor-alerts', protect, authorizeRoles('Admin'), getBachelorAlerts);
router.put('/bachelor-verification/:id', protect, authorizeRoles('Admin'), updateBachelorStatus);

export default router;
