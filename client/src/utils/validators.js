/**
 * @file validators.js
 * @description Unicode-aware form validation for Maa Kaushalya RWA.
 * 
 * SOLVES: Name fields rejecting Hindi text, phone validation issues,
 * Aadhaar format validation, and flat number format enforcement.
 */

// ─────────────────────────────────────────────────────────────────────────────
// UNICODE RANGES
// ─────────────────────────────────────────────────────────────────────────────
const DEVANAGARI = '\u0900-\u097F';     // Hindi, Sanskrit, Nepali
const LATIN = 'a-zA-Z';
const DIGITS = '0-9';
const COMMON_CHARS = '\\s\\.\\-\\_\\(\\)';

// ─────────────────────────────────────────────────────────────────────────────
// NAME VALIDATION — accepts Hindi + English + common chars
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates a person's name (Hindi or English or mixed).
 * Allows: अ-ह, A-Z, spaces, dots, hyphens
 * Rejects: numbers, special chars, emojis, SQL injection attempts
 */
export const isValidName = (name) => {
  if (!name || name.trim().length < 2) return false;
  if (name.trim().length > 100) return false;
  // Allow Devanagari, Latin letters, spaces, dots, hyphens, apostrophes
  const nameRegex = new RegExp(`^[${DEVANAGARI}${LATIN}${COMMON_CHARS}']+$`);
  return nameRegex.test(name.trim());
};

export const getNameError = (name) => {
  if (!name || name.trim().length < 2) return 'नाम कम से कम 2 अक्षर का होना चाहिए।';
  if (name.trim().length > 100) return 'नाम 100 अक्षरों से अधिक नहीं हो सकता।';
  if (!isValidName(name)) return 'नाम में केवल अक्षर (हिंदी/अंग्रेजी), स्पेस, और "-" उपयोग करें।';
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const getEmailError = (email) => {
  if (!email) return 'ईमेल पता आवश्यक है।';
  if (!isValidEmail(email)) return 'वैध ईमेल पता दर्ज करें। (example@mail.com)';
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// PHONE VALIDATION — Indian mobile numbers
// ─────────────────────────────────────────────────────────────────────────────
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Strip spaces, dashes, +91 prefix for validation
  const stripped = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^91/, '');
  // Indian mobile: 10 digits starting with 6-9
  return /^[6-9][0-9]{9}$/.test(stripped);
};

export const getPhoneError = (phone) => {
  if (!phone) return 'मोबाइल नंबर आवश्यक है।';
  if (!isValidPhone(phone)) return 'वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।';
  return null;
};

/**
 * Normalizes phone to E.164 format for storage (+91XXXXXXXXXX)
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  const stripped = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^91/, '');
  return `+91${stripped}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// AADHAAR VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
export const isValidAadhaar = (aadhaar) => {
  if (!aadhaar) return true; // Optional field
  const stripped = aadhaar.replace(/\s/g, '');
  return /^[2-9]{1}[0-9]{11}$/.test(stripped); // 12 digits, starts with 2-9
};

export const getAadhaarError = (aadhaar) => {
  if (!aadhaar) return null; // Optional
  if (!isValidAadhaar(aadhaar)) return 'वैध 12-अंकीय आधार नंबर दर्ज करें।';
  return null;
};

/**
 * Formats Aadhaar for display: XXXX XXXX XXXX
 */
export const formatAadhaar = (aadhaar) => {
  if (!aadhaar) return '';
  const stripped = aadhaar.replace(/\s/g, '');
  return stripped.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};

// ─────────────────────────────────────────────────────────────────────────────
// FLAT NUMBER VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Validates flat number format: Letter-Number (e.g. A-101, B-202)
 */
export const isValidFlatNo = (flatNo) => {
  if (!flatNo) return false;
  return /^[A-Z]-\d{3}$/.test(flatNo.trim().toUpperCase());
};

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const getPasswordError = (password) => {
  if (!password) return 'पासवर्ड आवश्यक है।';
  if (password.length < 6) return 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।';
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATE VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
export const isValidDate = (dateStr) => {
  if (!dateStr) return true; // Optional
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

// ─────────────────────────────────────────────────────────────────────────────
// BATCH VALIDATOR — validate entire Add Member form at once
// ─────────────────────────────────────────────────────────────────────────────
export const validateMemberForm = ({ name, email, password, phone, role, flatNo, aadhaarNumber }) => {
  const errors = {};
  
  const nameErr = getNameError(name);
  if (nameErr) errors.name = nameErr;
  
  const emailErr = getEmailError(email);
  if (emailErr) errors.email = emailErr;
  
  const passErr = getPasswordError(password);
  if (passErr) errors.password = passErr;
  
  if (phone) {
    const phoneErr = getPhoneError(phone);
    if (phoneErr) errors.phone = phoneErr;
  }
  
  if (role === 'Resident' && !flatNo) {
    errors.flatNo = 'निवासी के लिए फ्लैट नंबर आवश्यक है।';
  }
  
  if (aadhaarNumber) {
    const aadhaarErr = getAadhaarError(aadhaarNumber);
    if (aadhaarErr) errors.aadhaarNumber = aadhaarErr;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
