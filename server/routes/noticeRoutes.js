import express from 'express';
import { getSocietyNotices, createSocietyNotice } from '../controllers/noticeController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSocietyNotices);
router.post('/', protect, authorizeRoles('Admin', 'Committee'), createSocietyNotice);

export default router;
