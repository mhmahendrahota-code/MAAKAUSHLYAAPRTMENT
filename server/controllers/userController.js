import { queries } from '../models/queries.js';

// @desc    Get current logged in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user has already been populated and sanitized by the 'protect' middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get directory listing of all society members
// @route   GET /api/users/directory
// @access  Private
export const getSocietyDirectory = async (req, res, next) => {
  try {
    const allUsers = await queries.getAllUsers();
    
    // Format a directory of residents and admins, hiding sensitive credentials
    const directory = allUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      flat_no: user.flat_no,
      phone: user.phone,
      occupancy_status: user.occupancy_status,
      owner_name: user.owner_name,
      owner_phone: user.owner_phone,
      aadhaar_number: user.aadhaar_number,
      family_members: user.family_members,
      family_member_names: user.family_member_names,
      vehicles: user.vehicles,
      move_in_date: user.move_in_date,
      lease_duration: user.lease_duration,
      emergency_contact_name: user.emergency_contact_name,
      emergency_contact_phone: user.emergency_contact_phone,
      profile_picture: user.profile_picture,
      has_pet: user.has_pet,
      pet_details: user.pet_details,
      is_legacy_bachelor: user.is_legacy_bachelor || false,
      exemption_ref: user.exemption_ref || '',
      tenant_type: user.tenant_type || 'Family',
      police_verification_status: user.police_verification_status || 'pending',
      police_verification_date: user.police_verification_date || null,
      noc_document_ref: user.noc_document_ref || null,
      bachelor_notes: user.bachelor_notes || null,
      is_approved: user.is_approved !== false,
      created_at: user.created_at
    }));

    res.status(200).json({
      success: true,
      count: directory.length,
      data: directory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's profile data (Admin only)
// @route   PUT /api/users/update
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const {
      userId, name, email, phone, role, gender, flatNo, occupancyStatus, tenantType, ownerName, ownerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseDuration,
      emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails,
      isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes
    } = req.body;

    if (!userId || !name || !email || !role) {
      res.status(400);
      throw new Error('userId, name, email, and role are required');
    }

    const updatedUser = await queries.updateUser(userId, {
      name, email, phone, role, gender, flatNo, occupancyStatus, tenantType, ownerName, ownerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseDuration,
      emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails,
      isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes
    });

    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user from the directory (Admin only)
// @route   DELETE /api/users/delete/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const deletedUser = await queries.deleteUser(id);

    if (!deletedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bachelor tenants for alert monitoring (Admin only)
// @route   GET /api/users/bachelor-alerts
// @access  Private (Admin)
export const getBachelorAlerts = async (req, res, next) => {
  try {
    const alerts = await queries.getBachelorAlerts();
    
    // Add logic to determine lease expiry
    const processedAlerts = alerts.map(bachelor => {
      let isExpiringSoon = false;
      let daysUntilExpiry = null;
      let expiresAt = null;

      if (bachelor.move_in_date && bachelor.lease_duration) {
        // Simple heuristic: assuming lease_duration is something like "11 months"
        const durationStr = bachelor.lease_duration.toLowerCase();
        let months = 11; // default
        const match = durationStr.match(/(\d+)/);
        if (match) months = parseInt(match[1], 10);
        
        const startDate = new Date(bachelor.move_in_date);
        const expiryDate = new Date(startDate.setMonth(startDate.getMonth() + months));
        expiresAt = expiryDate;
        
        const diffTime = expiryDate.getTime() - new Date().getTime();
        daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= -30; // Within 30 days or expired recently
      }

      return {
        ...bachelor,
        is_expiring_soon: isExpiringSoon,
        days_until_expiry: daysUntilExpiry,
        expires_at: expiresAt
      };
    });

    res.status(200).json({
      success: true,
      count: processedAlerts.length,
      data: processedAlerts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a bachelor tenant's police verification status (Admin only)
// @route   PUT /api/users/bachelor-verification/:id
// @access  Private (Admin)
export const updateBachelorStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, date, nocRef, notes } = req.body;

    if (!id) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const updated = await queries.updateBachelorVerification(id, { status, date, nocRef, notes });

    if (!updated) {
      res.status(404);
      throw new Error('Bachelor tenant not found');
    }

    res.status(200).json({
      success: true,
      message: 'Verification status updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a newly registered user account (Admin only)
// @route   PUT /api/users/:id/approve
// @access  Private (Admin)
export const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const approved = await queries.approveUser(id);

    if (!approved) {
      res.status(404);
      throw new Error('User account not found');
    }

    res.status(200).json({
      success: true,
      message: 'Account approved successfully',
      data: approved
    });
  } catch (error) {
    next(error);
  }
};
