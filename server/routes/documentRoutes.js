import express from 'express';
import { getDocuments, createDocument, deleteDocument, submitForm, getSubmissions, updateSubmissionStatus } from '../controllers/documentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDocuments);
router.post('/', protect, authorizeRoles('Admin'), createDocument);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteDocument);

router.post('/submissions', protect, submitForm);
router.get('/submissions', protect, getSubmissions);
router.put('/submissions/:id/status', protect, authorizeRoles('Admin'), updateSubmissionStatus);

export default router;
