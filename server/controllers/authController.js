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
      exemptionRef,
      isApproved: false // Self-registered accounts require admin approval
    });

    res.status(201).json({
      success: true,
      message: 'रजिस्ट्रेशन सफल रहा। आपका अकाउंट एडमिन के अप्रूवल के लिए लंबित है।',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_approved: false
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

    // Check if user is approved by RWA Admin
    if (user.is_approved === false) {
      res.status(403);
      throw new Error('आपका अकाउंट एडमिन के अप्रूवल (अनुमोदन) के लिए लंबित है। कृपया एडमिन से संपर्क करें।');
    }

    // Match hashed passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password credentials');
    }

    // Generate JWT token
    const token = generateToken(user.id);
    // Set httpOnly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    // Respond without sensitive PII and without token in body
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
        // Add any other non‑PII fields you wish to expose
      }
    });
  } catch (error) {
    next(error);
  }
};
