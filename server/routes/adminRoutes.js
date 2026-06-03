import express from 'express';
import { 
  getDashboardStats, 
  getExpenses, 
  createExpense, 
  deleteExpense,
  bulkImportUsers,
  getReportData
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stats aggregates endpoint
router.get('/dashboard-stats', protect, authorizeRoles('Admin', 'Committee'), getDashboardStats);

// Society Expenses CRUD
router.get('/expenses', protect, authorizeRoles('Admin', 'Committee'), getExpenses);
router.post('/expenses', protect, authorizeRoles('Admin', 'Committee'), createExpense);
router.delete('/expenses/:id', protect, authorizeRoles('Admin', 'Committee'), deleteExpense);

// CSV Bulk import
router.post('/users/bulk-import', protect, authorizeRoles('Admin', 'Committee'), bulkImportUsers);

// Reports
router.get('/reports', protect, authorizeRoles('Admin', 'Committee'), getReportData);

export default router;
