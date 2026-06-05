/**
 * @file i18n.js
 * @description Centralized bilingual text store for Maa Kaushalya Apartment RWA.
 * 
 * RULE: All user-facing text MUST come from this file.
 * - Keys are always English (machine-readable identifiers)
 * - Values are bilingual: Hindi primary, English in parentheses
 * - DB-stored values (role, occupancy_status) STAY in English always
 */

// ─────────────────────────────────────────────────────────────────────────────
// ROLES — DB value → Display label
// ─────────────────────────────────────────────────────────────────────────────
export const ROLE_LABELS = {
  Admin:     'मुख्य एडमिन (Admin)',
  Resident:  'निवासी (Resident)',
  Committee: 'समिति सदस्य (Committee)',
  Security:  'सुरक्षा (Security)',
};

export const ROLE_COLORS = {
  Admin:     'text-brand-300 bg-brand-500/10 border-brand-500/25',
  Resident:  'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
  Committee: 'text-sky-300 bg-sky-500/10 border-sky-500/25',
  Security:  'text-violet-300 bg-violet-500/10 border-violet-500/25',
};

// ─────────────────────────────────────────────────────────────────────────────
// OCCUPANCY STATUS — DB value → Display label
// ─────────────────────────────────────────────────────────────────────────────
export const OCCUPANCY_LABELS = {
  'Self-Occupied': 'स्व-कब्जा (Self-Occupied)',
  'Rented':        'किराये पर (Rented)',
  'Vacant':        'रिक्त (Vacant)',
};

export const OCCUPANCY_COLORS = {
  'Self-Occupied': 'text-emerald-400 bg-emerald-400/10',
  'Rented':        'text-sky-400 bg-sky-400/10',
  'Vacant':        'text-amber-400 bg-amber-400/10',
};

// ─────────────────────────────────────────────────────────────────────────────
// GENDER
// ─────────────────────────────────────────────────────────────────────────────
export const GENDER_LABELS = {
  Male:   'पुरुष (Male)',
  Female: 'महिला (Female)',
  Other:  'अन्य (Other)',
};

// ─────────────────────────────────────────────────────────────────────────────
// FILTER LABELS (Directory page stat cards and tabs)
// ─────────────────────────────────────────────────────────────────────────────
export const FILTER_LABELS = {
  All:          'सभी सदस्य',
  All_Flats:    'कुल फ्लैट (512)',
  Resident:     'निवासी',
  Committee:    'समिति',
  Admin:        'एडमिन',
  Security:     'सुरक्षा',
  Pending:      'अनुमोदन लंबित',
  'Self-Occupied': 'स्व-कब्जा',
  Rented:       'किराये पर',
  Vacant:       'रिक्त फ्लैट',
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMON UI STRINGS
// ─────────────────────────────────────────────────────────────────────────────
export const UI = {
  noFlatApplicable:  'लागू नहीं (Admin/Committee/Security)',
  vacantFlat:        'रिक्त फ्लैट (Vacant Flat)',
  notAvailable:      'उपलब्ध नहीं',
  loading:           'डेटा लोड हो रहा है…',
  noResults:         'कोई परिणाम नहीं मिला।',
  search:            'नाम, फ्लैट, ईमेल से खोजें…',
  addMember:         'नया सदस्य जोड़ें',
  editMember:        'सदस्य विवरण संपादित करें',
  deleteMember:      'सदस्य हटाएं',
  approve:           'अनुमोदित करें',
  reject:            'अस्वीकार करें',
  save:              'सहेजें',
  cancel:            'रद्द करें',
  confirm:           'पुष्टि करें',
  success:           'सफल!',
  error:             'त्रुटि!',
};

// ─────────────────────────────────────────────────────────────────────────────
// ERROR MESSAGES — backend error codes → user-facing bilingual message
// ─────────────────────────────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  // Auth errors
  ERR_USER_EXISTS:         'इस ईमेल से पहले से खाता मौजूद है। (User already exists)',
  ERR_INVALID_ROLE:        'अमान्य भूमिका चुनी गई। (Invalid role)',
  ERR_FLAT_OCCUPIED:       'यह फ्लैट पहले से पंजीकृत है। (Flat already registered)',
  ERR_VEHICLE_LIMIT:       'वाहन सीमा पार: प्रति फ्लैट अधिकतम 1 कार + 2 बाइक। (Vehicle limit exceeded)',
  ERR_CAR_LIMIT:           'प्रति फ्लैट अधिकतम 1 कार की अनुमति है। (Max 1 car per flat)',
  ERR_BIKE_LIMIT:          'प्रति फ्लैट अधिकतम 2 बाइक की अनुमति है। (Max 2 bikes per flat)',
  ERR_WEAK_PASSWORD:       'पासवर्ड कम से कम 6 अक्षर का होना चाहिए। (Password too short)',
  ERR_INVALID_CREDENTIALS: 'ईमेल या पासवर्ड गलत है। (Invalid credentials)',
  ERR_NOT_APPROVED:        'आपका खाता अभी अनुमोदन के लिए लंबित है। (Account pending approval)',
  ERR_NOT_FOUND:           'उपयोगकर्ता नहीं मिला। (User not found)',
  ERR_UNAUTHORIZED:        'आपको इस क्रिया की अनुमति नहीं है। (Unauthorized)',
  ERR_SERVER:              'सर्वर में त्रुटि। कृपया बाद में पुनः प्रयास करें। (Server error)',
  ERR_REQUIRED_FIELDS:     'कृपया सभी आवश्यक फ़ील्ड भरें। (Required fields missing)',
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Get role label safely
// ─────────────────────────────────────────────────────────────────────────────
export const getRoleLabel = (role) => ROLE_LABELS[role] || role || '—';
export const getOccupancyLabel = (status) => OCCUPANCY_LABELS[status] || status || '—';
export const getGenderLabel = (gender) => GENDER_LABELS[gender] || gender || '—';
export const getRoleColor = (role) => ROLE_COLORS[role] || 'text-slate-400 bg-slate-500/10 border-slate-500/25';
export const getOccupancyColor = (status) => OCCUPANCY_COLORS[status] || 'text-slate-400 bg-slate-400/10';

/**
 * Maps a backend error message to a bilingual user-friendly error.
 * Falls back to the original message if no mapping found.
 */
export const mapApiError = (rawMessage = '') => {
  const msg = rawMessage.toLowerCase();
  if (msg.includes('already exists') || msg.includes('पहले से')) return ERROR_MESSAGES.ERR_USER_EXISTS;
  if (msg.includes('vehicle') || msg.includes('वाहन')) {
    if (msg.includes('car') || msg.includes('कार')) return ERROR_MESSAGES.ERR_CAR_LIMIT;
    if (msg.includes('bike') || msg.includes('बाइक')) return ERROR_MESSAGES.ERR_BIKE_LIMIT;
    return ERROR_MESSAGES.ERR_VEHICLE_LIMIT;
  }
  if (msg.includes('flat') && (msg.includes('occupied') || msg.includes('पंजीकृत'))) return ERROR_MESSAGES.ERR_FLAT_OCCUPIED;
  if (msg.includes('password') && (msg.includes('6') || msg.includes('short'))) return ERROR_MESSAGES.ERR_WEAK_PASSWORD;
  if (msg.includes('invalid credentials') || msg.includes('incorrect')) return ERROR_MESSAGES.ERR_INVALID_CREDENTIALS;
  if (msg.includes('pending') || msg.includes('approval')) return ERROR_MESSAGES.ERR_NOT_APPROVED;
  if (msg.includes('not found') || msg.includes('नहीं मिला')) return ERROR_MESSAGES.ERR_NOT_FOUND;
  if (msg.includes('unauthorized') || msg.includes('forbidden')) return ERROR_MESSAGES.ERR_UNAUTHORIZED;
  if (msg.includes('required') || msg.includes('provide')) return ERROR_MESSAGES.ERR_REQUIRED_FIELDS;
  // Fallback: return original message
  return rawMessage;
};
