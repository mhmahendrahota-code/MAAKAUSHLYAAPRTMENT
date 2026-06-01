import express from 'express';
import { 
  getUserProfile, 
  getSocietyDirectory, 
  updateUser, 
  deleteUser, 
  getBachelorAlerts, 
  updateBachelorStatus, 
  approveUser, 
  updateOwnProfile, 
  getFullDatabaseDump,
  createDatabaseRecord,
  updateDatabaseRecord,
  deleteDatabaseRecord
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/directory', protect, getSocietyDirectory);
router.get('/db-inspect', protect, authorizeRoles('Admin'), getFullDatabaseDump);

// Dynamic database inspection CRUD endpoints (restricted to Admins only)
router.post('/db-inspect/:table', protect, authorizeRoles('Admin'), createDatabaseRecord);
router.put('/db-inspect/:table/:id', protect, authorizeRoles('Admin'), updateDatabaseRecord);
router.delete('/db-inspect/:table/:id', protect, authorizeRoles('Admin'), deleteDatabaseRecord);

router.put('/update', protect, authorizeRoles('Admin', 'Committee'), updateUser);
router.put('/update-profile', protect, updateOwnProfile);
router.delete('/delete/:id', protect, authorizeRoles('Admin', 'Committee'), deleteUser);
router.put('/approve/:id', protect, authorizeRoles('Admin', 'Committee'), approveUser);

// Bachelor Tenant Routes
router.get('/bachelor-alerts', protect, authorizeRoles('Admin', 'Committee'), getBachelorAlerts);
router.put('/bachelor-verification/:id', protect, authorizeRoles('Admin', 'Committee'), updateBachelorStatus);

export default router;
