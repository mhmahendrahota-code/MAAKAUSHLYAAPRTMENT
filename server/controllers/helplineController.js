import { queries } from '../models/queries.js';

// @desc    Get all society helplines
// @route   GET /api/helplines
// @access  Private (Admin / Resident / Security)
export const getHelplines = async (req, res, next) => {
  try {
    const helplines = await queries.getHelplines();
    res.status(200).json({
      success: true,
      count: helplines.length,
      data: helplines
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new emergency helpline
// @route   POST /api/helplines
// @access  Private (Admin Only)
export const addHelpline = async (req, res, next) => {
  try {
    const { title, number, note, displayOrder } = req.body;

    if (!title || !number) {
      res.status(400);
      throw new Error('Please provide helpline title and phone number');
    }

    const newHelpline = await queries.createHelpline({
      title,
      number,
      note,
      displayOrder: parseInt(displayOrder) || 0
    });

    res.status(201).json({
      success: true,
      message: 'Helpline added successfully',
      data: newHelpline
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a helpline entry
// @route   PUT /api/helplines/:id
// @access  Private (Admin Only)
export const updateHelpline = async (req, res, next) => {
  try {
    const { title, number, note, displayOrder } = req.body;
    const helplineId = req.params.id;

    if (!title || !number) {
      res.status(400);
      throw new Error('Please provide helpline title and phone number');
    }

    const updatedHelpline = await queries.updateHelpline(helplineId, {
      title,
      number,
      note,
      displayOrder: parseInt(displayOrder) || 0
    });

    if (!updatedHelpline) {
      res.status(404);
      throw new Error('Helpline not found');
    }

    res.status(200).json({
      success: true,
      message: 'Helpline details updated successfully',
      data: updatedHelpline
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an emergency helpline
// @route   DELETE /api/helplines/:id
// @access  Private (Admin Only)
export const removeHelpline = async (req, res, next) => {
  try {
    const helplineId = req.params.id;
    const deletedHelpline = await queries.deleteHelpline(helplineId);

    if (!deletedHelpline) {
      res.status(404);
      throw new Error('Helpline not found');
    }

    res.status(200).json({
      success: true,
      message: 'Helpline removed successfully',
      data: deletedHelpline
    });
  } catch (error) {
    next(error);
  }
};
