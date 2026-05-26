import { queries } from '../models/queries.js';

// @desc    Get all society notices
// @route   GET /api/notices
// @access  Private (Admin / Resident / Security)
export const getSocietyNotices = async (req, res, next) => {
  try {
    const notices = await queries.getNotices();
    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Broadcast a new notice bulletin
// @route   POST /api/notices
// @access  Private (Admin Only)
export const createSocietyNotice = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error('Please provide notice title and content bulletin');
    }

    const newNotice = await queries.createNotice({
      title,
      content,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Notice broadcasted successfully to all residents',
      data: newNotice
    });
  } catch (error) {
    next(error);
  }
};
