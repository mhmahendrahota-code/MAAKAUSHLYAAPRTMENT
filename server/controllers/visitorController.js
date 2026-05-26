import { queries } from '../models/queries.js';

// @desc    Log a new visitor check-in
// @route   POST /api/visitors/checkin
// @access  Private (Security Only)
export const checkinVisitor = async (req, res, next) => {
  try {
    const { name, phone, purpose, gender, flatNo } = req.body;

    if (!name || !phone || !purpose || !flatNo) {
      res.status(400);
      throw new Error('Please provide visitor name, phone, purpose, and target flatNo');
    }

    const log = await queries.createVisitorLog({
      name,
      phone,
      purpose,
      gender,
      flatNo,
      loggedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: `Visitor ${name} checked in successfully for flat ${flatNo}`,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a visitor check-out
// @route   PUT /api/visitors/checkout/:id
// @access  Private (Security / Admin)
export const checkoutVisitor = async (req, res, next) => {
  try {
    const logId = req.params.id;

    if (!logId) {
      res.status(400);
      throw new Error('Please specify visitor log entry ID');
    }

    const logs = await queries.getVisitorLogs();
    const targetLog = logs.find(l => l.id === parseInt(logId));

    if (!targetLog) {
      res.status(404);
      throw new Error('Visitor check-in log record not found');
    }

    if (targetLog.check_out) {
      res.status(400);
      throw new Error('Visitor has already checked out');
    }

    const updatedLog = await queries.checkoutVisitor(logId);

    res.status(200).json({
      success: true,
      message: `Visitor ${targetLog.name} checked out successfully`,
      data: updatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get visitor logs history
// @route   GET /api/visitors
// @access  Private (Admin / Security / Resident)
export const getVisitorLogs = async (req, res, next) => {
  try {
    const allLogs = await queries.getVisitorLogs();
    let logsResponse = [];

    if (req.user.role === 'Admin' || req.user.role === 'Security') {
      // Admin and Security see full visitor traffic
      logsResponse = allLogs;
    } else {
      // Residents can only audit visitors logged for their own flat
      const residentFlat = req.user.flat_no;
      if (!residentFlat) {
        logsResponse = [];
      } else {
        logsResponse = allLogs.filter(
          log => log.flat_no && log.flat_no.toLowerCase() === residentFlat.toLowerCase()
        );
      }
    }

    res.status(200).json({
      success: true,
      count: logsResponse.length,
      data: logsResponse
    });
  } catch (error) {
    next(error);
  }
};
