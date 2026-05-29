import { queries } from '../models/queries.js';
import bcrypt from 'bcryptjs';

// @desc    Get current logged in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user has already been populated and sanitized by the 'protect' middleware
    res.status(200).json({
      success: true,
      token: req.cookies?.auth_token || (req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null),
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
    
    const isAdmin = req.user && req.user.role === 'Admin';

    // Format a directory of residents and admins, hiding sensitive credentials & masking PII
    const directory = allUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      flat_no: user.flat_no,
      phone: user.phone,
      occupancy_status: user.occupancy_status,
      tenant_type: user.tenant_type,
      owner_name: user.owner_name,
      owner_phone: user.owner_phone,
      aadhaar_number: isAdmin ? user.aadhaar_number : (user.aadhaar_number ? 'XXXX XXXX ' + user.aadhaar_number.trim().slice(-4) : null),
      family_members: user.family_members,
      family_member_names: user.family_member_names,
      vehicles: user.vehicles,
      move_in_date: user.move_in_date,
      lease_duration: user.lease_duration,
      lease_agreement_submitted: user.lease_agreement_submitted,
      emergency_contact_name: user.emergency_contact_name,
      emergency_contact_phone: user.emergency_contact_phone,
      profile_picture: user.profile_picture,
      has_pet: user.has_pet,
      pet_details: user.pet_details,
      is_legacy_bachelor: user.is_legacy_bachelor,
      exemption_ref: user.exemption_ref,
      police_verification_status: user.police_verification_status,
      police_verification_date: user.police_verification_date,
      noc_document_ref: user.noc_document_ref,
      bachelor_notes: user.bachelor_notes,
      is_approved: user.is_approved,
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
      userId, name, email, password, phone, role, gender, flatNo, occupancyStatus, tenantType, ownerName, ownerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseDuration, leaseAgreementSubmitted,
      emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails,
      isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes
    } = req.body;

    if (!userId || !name || !email || !role) {
      res.status(400);
      throw new Error('userId, name, email, and role are required');
    }

    let passwordHash = null;
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await queries.updateUser(userId, {
      name, email, phone, role, gender, flatNo, occupancyStatus, tenantType, ownerName, ownerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseDuration, leaseAgreementSubmitted,
      emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails,
      isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes,
      passwordHash
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

// @desc    Update current user's email/password (Own account update)
// @route   PUT /api/users/update-profile
// @access  Private
export const updateOwnProfile = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userId = req.user.id;

    if (!email) {
      res.status(400);
      throw new Error('Email/UserID is required');
    }

    let passwordHash = null;
    if (password) {
      if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const updated = await queries.updateUserCredentials(userId, email, passwordHash);

    if (!updated) {
      res.status(404);
      throw new Error('User account not found');
    }

    res.status(200).json({
      success: true,
      message: 'Profile credentials updated successfully',
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role
      }
    });
  } catch (error) {
    next(error);
  }
};
