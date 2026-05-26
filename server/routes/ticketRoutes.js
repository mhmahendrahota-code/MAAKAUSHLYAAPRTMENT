import express from 'express';
import { createComplaintTicket, updateTicketStatus, getTicketsHistory } from '../controllers/ticketController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createComplaintTicket);
router.put('/update', protect, authorizeRoles('Admin'), updateTicketStatus);
router.get('/history', protect, getTicketsHistory);

export default router;
