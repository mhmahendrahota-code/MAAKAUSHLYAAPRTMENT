import { queries } from '../models/queries.js';

// @desc    Generate a new maintenance bill for a resident flat
// @route   POST /api/bills/generate
// @access  Private (Admin Only)
export const generateMaintenanceBill = async (req, res, next) => {
  try {
    const { residentId, amount, billingMonth, dueDate } = req.body;

    if (!residentId || !amount || !billingMonth || !dueDate) {
      res.status(400);
      throw new Error('Please provide residentId, amount, billingMonth, and dueDate');
    }

    // Verify the target user is a resident
    const targetUser = await queries.findUserById(residentId);
    if (!targetUser) {
      res.status(404);
      throw new Error('Resident user not found');
    }

    if (targetUser.role !== 'Resident') {
      res.status(400);
      throw new Error('Maintenance bills can only be generated for users with the Resident role');
    }

    const bill = await queries.createBill({
      residentId,
      amount,
      billingMonth,
      dueDate
    });

    res.status(201).json({
      success: true,
      message: `Maintenance bill of ₹${amount} created for ${targetUser.name} (Flat ${targetUser.flat_no || 'N/A'})`,
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit payment information for a maintenance bill
// @route   POST /api/bills/pay
// @access  Private (Resident / Admin)
export const payMaintenanceBill = async (req, res, next) => {
  try {
    const { billId, paymentReference } = req.body;

    if (!billId || !paymentReference) {
      res.status(400);
      throw new Error('Please provide billId and paymentReference transaction code');
    }

    // Verify bill exists
    const allBills = await queries.getAllBills();
    const targetBill = allBills.find(b => b.id === parseInt(billId));

    if (!targetBill) {
      res.status(404);
      throw new Error('Maintenance bill record not found');
    }

    // If logged in as resident, ensure they can only pay their own bill
    if (req.user.role === 'Resident' && targetBill.resident_id !== req.user.id) {
      res.status(403);
      throw new Error('Unauthorized. You cannot submit payments for another resident\'s bill');
    }

    if (targetBill.status === 'paid') {
      res.status(400);
      throw new Error('This maintenance bill is already paid');
    }

    const updatedBill = await queries.payBill(billId, paymentReference);

    res.status(200).json({
      success: true,
      message: 'Payment received successfully. Bill marked as PAID.',
      data: updatedBill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bills listing
// @route   GET /api/bills/history
// @access  Private (Admin / Resident)
export const getBillsHistory = async (req, res, next) => {
  try {
    let billsList = [];

    if (req.user.role === 'Admin') {
      // Admins see all society bills
      billsList = await queries.getAllBills();
    } else {
      // Residents see only their own bills
      billsList = await queries.getBillsByResident(req.user.id);
    }

    res.status(200).json({
      success: true,
      count: billsList.length,
      data: billsList
    });
  } catch (error) {
    next(error);
  }
};
