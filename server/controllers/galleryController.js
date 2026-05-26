import { queries } from '../models/queries.js';

// @desc    Get all gallery events/news
// @route   GET /api/gallery
// @access  Private (Admin / Resident / Security)
export const getGalleryEvents = async (req, res, next) => {
  try {
    const events = await queries.getGalleryEvents();
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new event/news bulletin with optional image
// @route   POST /api/gallery
// @access  Private (Admin Only)
export const addGalleryEvent = async (req, res, next) => {
  try {
    const { title, content, imageUrl, eventDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Please provide gallery event title');
    }

    const newEvent = await queries.createGalleryEvent({
      title,
      content,
      imageUrl,
      eventDate
    });

    res.status(201).json({
      success: true,
      message: 'Gallery event published successfully',
      data: newEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a gallery event's details
// @route   PUT /api/gallery/:id
// @access  Private (Admin Only)
export const updateGalleryEvent = async (req, res, next) => {
  try {
    const { title, content, imageUrl, eventDate } = req.body;
    const eventId = req.params.id;

    if (!title) {
      res.status(400);
      throw new Error('Please provide gallery event title');
    }

    const updatedEvent = await queries.updateGalleryEvent(eventId, {
      title,
      content,
      imageUrl,
      eventDate
    });

    if (!updatedEvent) {
      res.status(404);
      throw new Error('Gallery event not found');
    }

    res.status(200).json({
      success: true,
      message: 'Gallery event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an event from the gallery feed
// @route   DELETE /api/gallery/:id
// @access  Private (Admin Only)
export const removeGalleryEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await queries.deleteGalleryEvent(eventId);

    if (!deletedEvent) {
      res.status(404);
      throw new Error('Gallery event not found');
    }

    res.status(200).json({
      success: true,
      message: 'Gallery event removed successfully',
      data: deletedEvent
    });
  } catch (error) {
    next(error);
  }
};
