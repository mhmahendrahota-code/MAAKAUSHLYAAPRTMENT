import { queries } from '../models/queries.js';

// @desc    Lodge a new complaints/support ticket
// @route   POST /api/tickets/create
// @access  Private (Resident / Admin)
export const createComplaintTicket = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      res.status(400);
      throw new Error('Please provide title, description, and category');
    }

    const ticket = await queries.createTicket({
      title,
      description,
      category,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket lodged successfully. Resident Welfare Association desk has been notified.',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status (e.g. mark as Resolved or In Progress)
// @route   PUT /api/tickets/update
// @access  Private (Admin Only)
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId, status } = req.body;

    if (!ticketId || !status) {
      res.status(400);
      throw new Error('Please provide ticketId and new status');
    }

    if (!['open', 'in_progress', 'resolved'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Permitted levels: open, in_progress, resolved');
    }

    // Verify ticket exists
    const allTickets = await queries.getAllTickets();
    const targetTicket = allTickets.find(t => t.id === parseInt(ticketId));

    if (!targetTicket) {
      res.status(404);
      throw new Error('Ticket record not found');
    }

    const updatedTicket = await queries.updateTicketStatus(ticketId, status);

    res.status(200).json({
      success: true,
      message: `Ticket #${ticketId} status updated successfully to ${status.toUpperCase()}`,
      data: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get support tickets list
// @route   GET /api/tickets/history
// @access  Private (Admin / Resident)
export const getTicketsHistory = async (req, res, next) => {
  try {
    let ticketsList = [];

    if (req.user.role === 'Admin') {
      // Admin views all tickets in the society
      ticketsList = await queries.getAllTickets();
    } else {
      // Residents view only tickets they filed
      ticketsList = await queries.getTicketsByResident(req.user.id);
    }

    res.status(200).json({
      success: true,
      count: ticketsList.length,
      data: ticketsList
    });
  } catch (error) {
    next(error);
  }
};
