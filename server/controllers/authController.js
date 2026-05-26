import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queries } from '../models/queries.js';

// Helper to sign JWT Tokens
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_key_change_me_in_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user (Admin / Resident / Security)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { 
      name, email, password, role, gender, flatNo, phone, occupancyStatus, ownerName, ownerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseDuration, emergencyContactName, emergencyContactPhone, profilePicture,
      hasPet, petDetails, isLegacyBachelor, exemptionRef
    } = req.body;

    // Validate request inputs
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please provide name, email, password, and role');
    }

    if (!['Admin', 'Resident', 'Security'].includes(role)) {
      res.status(400);
      throw new Error('Invalid user role specified');
    }

    // Check if user already exists
    const userExists = await queries.findUserByEmail(email);
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email address');
    }

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Write user to database/store
    const user = await queries.createUser({
      name,
      email,
      passwordHash,
      role,
      gender: gender || 'Male',
      flatNo,
      phone,
      occupancyStatus,
      ownerName,
      ownerPhone,
      aadhaarNumber,
      familyMembers,
      familyMemberNames,
      vehicles,
      moveInDate,
      leaseDuration,
      emergencyContactName,
      emergencyContactPhone,
      profilePicture,
      hasPet,
      petDetails,
      isLegacyBachelor,
      exemptionRef
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
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
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request inputs
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Query user
    const user = await queries.findUserByEmail(email);
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password credentials');
    }

    // Match hashed passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password credentials');
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
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
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    next(error);
  }
};
