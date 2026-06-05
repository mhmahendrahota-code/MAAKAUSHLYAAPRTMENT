import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queries } from '../models/queries.js';

const validateVehicleLimits = (vehicles) => {
  if (!vehicles) return;
  let parsed = vehicles;
  if (typeof vehicles === 'string') {
    try {
      parsed = JSON.parse(vehicles);
    } catch (e) {
      return;
    }
  }
  if (!Array.isArray(parsed)) return;

  if (parsed.length > 3) {
    throw new Error('एक फ्लैट में अधिकतम 3 वाहनों की अनुमति है। (Maximum of 3 vehicles allowed per flat)');
  }

  let cars = 0;
  let bikes = 0;
  for (const v of parsed) {
    const type = (v.type || '').toLowerCase();
    if (type === 'car' || type === 'four-wheeler' || type === 'four wheeler') {
      cars++;
    } else if (type === 'bike' || type === 'two-wheeler' || type === 'two wheeler' || type === 'motorcycle' || type === 'scooter') {
      bikes++;
    }
  }

  if (cars > 1) {
    throw new Error('पार्किंग सीमा पार: प्रति फ्लैट अधिकतम 1 कार की अनुमति है। (Maximum of 1 Car allowed per flat)');
  }
  if (bikes > 2) {
    throw new Error('पार्किंग सीमा पार: प्रति फ्लैट अधिकतम 2 बाइक की अनुमति है। (Maximum of 2 Bikes allowed per flat)');
  }
};

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
      name, email, password, role, gender, flatNo, phone, occupancyStatus, tenantType, ownerName, ownerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseExpiryDate, leaseDuration, leaseAgreementSubmitted, emergencyContactName, emergencyContactPhone, profilePicture,
      hasPet, petDetails, isLegacyBachelor, exemptionRef
    } = req.body;

    // Validate request inputs
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please provide name, email, password, and role');
    }

    if (!['Admin', 'Resident', 'Security', 'Committee'].includes(role)) {
      res.status(400);
      throw new Error('Invalid user role specified');
    }

    // Check if user already exists
    const userExists = await queries.findUserByEmail(email);
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email address');
    }

    // Validate vehicle limits
    if (vehicles) {
      try {
        validateVehicleLimits(vehicles);
      } catch (err) {
        res.status(400);
        throw err;
      }
    }

    // Check if flat is already registered by an approved resident
    if (role === 'Resident' && flatNo) {
      const residentsInFlat = await queries.findUsersByFlatNo(flatNo);
      const approvedResidents = residentsInFlat.filter(u => u.is_approved && u.role === 'Resident');

      const incomingIsTenant = occupancyStatus === 'Rented' && !!(ownerName && ownerName.trim());
      const incomingIsSelfOccupied = (occupancyStatus || 'Self-Occupied') === 'Self-Occupied';
      
      // Classify existing approved residents
      const existingTenants = approvedResidents.filter(u => u.occupancy_status === 'Rented' && !!(u.owner_name && u.owner_name.trim()));
      const existingOwners = approvedResidents.filter(u => u.occupancy_status === 'Self-Occupied' || u.occupancy_status === 'Vacant' || (u.occupancy_status === 'Rented' && !(u.owner_name && u.owner_name.trim())));
      const existingSelfOccupiedOwner = existingOwners.find(u => u.occupancy_status === 'Self-Occupied');

      if (incomingIsTenant) {
        if (existingTenants.length > 0) {
          res.status(400);
          throw new Error(`फ्लैट संख्या ${flatNo} पर पहले से ही एक सक्रिय किरायेदार (Tenant) पंजीकृत है। (आरडब्ल्यूए रिकॉर्ड में पहले से ही एक सक्रिय निवासी पंजीकृत है)`);
        }
        if (existingSelfOccupiedOwner) {
          res.status(400);
          throw new Error(`फ्लैट संख्या ${flatNo} पर पहले से ही एक सक्रिय स्व-अधिकृत मालिक (Self-Occupied Owner) पंजीकृत है। (आरडब्ल्यूए रिकॉर्ड में पहले से ही एक सक्रिय निवासी पंजीकृत है)`);
        }
      } else {
        if (existingOwners.length > 0) {
          res.status(400);
          throw new Error(`फ्लैट संख्या ${flatNo} पर पहले से ही एक सक्रिय फ्लैट मालिक (Owner) पंजीकृत है। (आरडब्ल्यूए रिकॉर्ड में पहले से ही एक सक्रिय निवासी पंजीकृत है)`);
        }
        if (incomingIsSelfOccupied && existingTenants.length > 0) {
          res.status(400);
          throw new Error(`फ्लैट संख्या ${flatNo} पर पहले से ही एक सक्रिय किरायेदार (Tenant) पंजीकृत है, इसलिए आप स्व-अधिकृत (Self-Occupied) के रूप में पंजीकृत नहीं हो सकते। (आरडब्ल्यूए रिकॉर्ड में पहले से ही एक सक्रिय निवासी पंजीकृत है)`);
        }
      }
    }

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Business Rule: Non-Resident roles (Admin, Committee, Security) का कोई flat number नहीं होता
    const resolvedFlatNo = role === 'Resident' ? flatNo : null;
    const resolvedOccupancyStatus = role === 'Resident' ? occupancyStatus : 'Self-Occupied';

    // Write user to database/store
    const user = await queries.createUser({
      name,
      email,
      passwordHash,
      role,
      gender: gender || 'Male',
      flatNo: resolvedFlatNo,
      phone,
      occupancyStatus: resolvedOccupancyStatus,
      tenantType,
      ownerName,
      ownerPhone,
      aadhaarNumber,
      familyMembers,
      familyMemberNames,
      vehicles,
      moveInDate,
      leaseExpiryDate,
      leaseDuration,
      leaseAgreementSubmitted,
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
    // Respond without sensitive PII and return token in body for client token state hydration
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
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
