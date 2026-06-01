import { queries } from '../models/queries.js';

// @desc    Get all system feature flags
// @route   GET /api/settings/features
// @access  Private (All authenticated users)
export const getFeatures = async (req, res, next) => {
  try {
    const flags = await queries.getFeatureFlags();
    res.status(200).json({
      success: true,
      data: flags
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a feature flag active/deactive state
// @route   PUT /api/settings/features/:key
// @access  Private (Admin Only)
export const updateFeature = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      res.status(400);
      throw new Error('is_active value is required in request body');
    }

    const updated = await queries.updateFeatureFlag(key, is_active);

    if (!updated) {
      res.status(404);
      throw new Error(`Feature flag with key '${key}' not found`);
    }

    res.status(200).json({
      success: true,
      message: `Feature '${key}' has been ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
