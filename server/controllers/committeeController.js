import { queries } from '../models/queries.js';

// @desc    Get all RWA committee members
// @route   GET /api/committee
// @access  Private (Admin / Resident / Security)
export const getCommittee = async (req, res, next) => {
  try {
    const members = await queries.getCommitteeMembers();
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new RWA committee member
// @route   POST /api/committee
// @access  Private (Admin Only)
export const addCommitteeMember = async (req, res, next) => {
  try {
    const { name, designation, phone, email, flatNo, displayOrder } = req.body;

    if (!name || !designation) {
      res.status(400);
      throw new Error('Please provide committee member name and designation');
    }

    const newMember = await queries.createCommitteeMember({
      name,
      designation,
      phone,
      email,
      flatNo,
      displayOrder: parseInt(displayOrder) || 0
    });

    res.status(201).json({
      success: true,
      message: 'Committee member registered successfully',
      data: newMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a committee member's details
// @route   PUT /api/committee/:id
// @access  Private (Admin Only)
export const updateCommitteeMember = async (req, res, next) => {
  try {
    const { name, designation, phone, email, flatNo, displayOrder } = req.body;
    const memberId = req.params.id;

    if (!name || !designation) {
      res.status(400);
      throw new Error('Please provide committee member name and designation');
    }

    const updatedMember = await queries.updateCommitteeMember(memberId, {
      name,
      designation,
      phone,
      email,
      flatNo,
      displayOrder: parseInt(displayOrder) || 0
    });

    if (!updatedMember) {
      res.status(404);
      throw new Error('Committee member not found');
    }

    res.status(200).json({
      success: true,
      message: 'Committee member details updated successfully',
      data: updatedMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a committee member
// @route   DELETE /api/committee/:id
// @access  Private (Admin Only)
export const removeCommitteeMember = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const deletedMember = await queries.deleteCommitteeMember(memberId);

    if (!deletedMember) {
      res.status(404);
      throw new Error('Committee member not found');
    }

    res.status(200).json({
      success: true,
      message: 'Committee member removed successfully',
      data: deletedMember
    });
  } catch (error) {
    next(error);
  }
};
