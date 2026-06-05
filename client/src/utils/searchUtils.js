/**
 * @file searchUtils.js
 * @description Smart bilingual search utility for Maa Kaushalya RWA.
 * 
 * SOLVES: Hindi "राजेश" search → finds "Rajesh" too, and vice versa.
 * 
 * Strategy:
 * 1. Normalize query (trim, lowercase)
 * 2. Try exact match first (fast path)
 * 3. Try transliteration map (Roman ↔ Devanagari common patterns)
 * 4. Flat number match is always exact (A-101 style)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Roman to Devanagari syllable mapping (common Indian names)
// ─────────────────────────────────────────────────────────────────────────────
const ROMAN_TO_DEVANAGARI = {
  'aa': 'आ', 'ai': 'ऐ', 'au': 'औ', 'ae': 'ए',
  'a': 'अ',  'i': 'इ',  'u': 'उ',  'e': 'ए', 'o': 'ओ',
  'ka': 'क', 'kha': 'ख', 'ga': 'ग', 'gha': 'घ',
  'ca': 'च', 'cha': 'च', 'ja': 'ज', 'jha': 'झ',
  'ta': 'त', 'tha': 'थ', 'da': 'द', 'dha': 'ध', 'na': 'न',
  'pa': 'प', 'pha': 'फ', 'fa': 'फ', 'ba': 'ब', 'bha': 'भ', 'ma': 'म',
  'ya': 'य', 'ra': 'र', 'la': 'ल', 'va': 'व', 'wa': 'व',
  'sha': 'श', 'sa': 'स', 'ha': 'ह',
  'ra': 'र', 'ri': 'रि',
  'k': 'क', 'g': 'ग', 'c': 'च', 'j': 'ज',
  't': 'त', 'd': 'द', 'n': 'न',
  'p': 'प', 'f': 'फ', 'b': 'ब', 'm': 'म',
  'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
  's': 'स', 'h': 'ह', 'z': 'ज',
};

// Common name-specific shortcuts (high frequency names in Indian societies)
const NAME_SHORTCUTS = {
  'rajesh': 'राजेश',
  'suresh': 'सुरेश',
  'ramesh': 'रमेश',
  'mahesh': 'महेश',
  'dinesh': 'दिनेश',
  'kamlesh': 'कमलेश',
  'mukesh': 'मुकेश',
  'ganesh': 'गणेश',
  'priya': 'प्रिया',
  'pooja': 'पूजा',
  'puja': 'पूजा',
  'anita': 'अनीता',
  'sunita': 'सुनीता',
  'geeta': 'गीता',
  'sita': 'सीता',
  'ram': 'राम',
  'shyam': 'श्याम',
  'arjun': 'अर्जुन',
  'ravi': 'रवि',
  'anil': 'अनिल',
  'sunil': 'सुनील',
  'kapil': 'कपिल',
  'sahil': 'साहिल',
  'rohit': 'रोहित',
  'mohit': 'मोहित',
  'amit': 'अमित',
  'sumit': 'सुमित',
  'sanjay': 'संजय',
  'vijay': 'विजय',
  'ajay': 'अजय',
  'uday': 'उदय',
  'manoj': 'मनोज',
  'pramod': 'प्रमोद',
  'vinod': 'विनोद',
  'ashok': 'अशोक',
  'alok': 'आलोक',
  'vivek': 'विवेक',
  'deepak': 'दीपक',
  'dipak': 'दीपक',
  'vikas': 'विकास',
  'prakash': 'प्रकाश',
  'rakesh': 'राकेश',
  'naresh': 'नरेश',
  'anand': 'आनंद',
  'kumar': 'कुमार',
  'sharma': 'शर्मा',
  'verma': 'वर्मा',
  'gupta': 'गुप्ता',
  'singh': 'सिंह',
  'yadav': 'यादव',
  'pandey': 'पांडे',
  'shukla': 'शुक्ला',
  'dubey': 'दुबे',
  'mishra': 'मिश्रा',
  'tiwari': 'तिवारी',
  'srivastava': 'श्रीवास्तव',
  'saxena': 'सक्सेना',
  'agarwal': 'अग्रवाल',
  'garg': 'गर्ग',
  'jain': 'जैन',
  'rastogi': 'रस्तोगी',
};

/**
 * Strips Hindi diacritics/matras for loose matching.
 * Example: "राजेश" → "राजश" (approximate)
 */
const stripDiacritics = (str) => {
  // Unicode ranges for Hindi matras (vowel signs)
  return str.replace(/[\u0900-\u0903\u093A-\u094F\u0951-\u0954]/g, '');
};

/**
 * Converts a Roman/English string to an approximate Devanagari representation.
 * Used to enable: "rajesh" search → matches "राजेश"
 */
const romanToDevanagari = (romanStr) => {
  const lower = romanStr.toLowerCase().trim();
  // Check name shortcuts first (most accurate)
  const words = lower.split(/\s+/);
  return words
    .map(word => NAME_SHORTCUTS[word] || word)
    .join(' ');
};

/**
 * Creates a normalized search-safe version of a string.
 * Removes extra spaces, lowercases, removes special chars.
 */
const normalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')          // collapse multiple spaces
    .replace(/[।॥""'']/g, '')      // remove Hindi punctuation
    .replace(/[-_]/g, ' ');        // treat hyphens as spaces
};

/**
 * Primary search function — checks if a user record matches the query.
 * Handles Hindi ↔ English cross-script matching.
 * 
 * @param {Object} user - User record from API
 * @param {string} query - Raw search query from input
 * @returns {boolean} true if user matches query
 */
export const userMatchesSearch = (user, query) => {
  if (!query || query.trim() === '') return true;

  const q = normalize(query);
  const qDevangari = romanToDevanagari(q); // Roman → Hindi approximation

  // Fields to search across
  const searchableFields = [
    normalize(user.name),
    normalize(user.email),
    normalize(user.flat_no),
    normalize(user.role),
    normalize(user.phone),
    normalize(user.occupancy_status),
    normalize(user.owner_name),
  ];

  // Check if query matches any field (exact substring)
  const directMatch = searchableFields.some(field => field.includes(q));
  if (directMatch) return true;

  // Check transliterated Hindi → does Devanagari version match any Hindi field?
  if (qDevangari !== q) {
    const hindiFields = [
      normalize(user.name),
      normalize(user.owner_name),
    ];
    const transMatch = hindiFields.some(field => field.includes(qDevangari));
    if (transMatch) return true;
  }

  // Check if query is in Devanagari and field is in Roman (reverse)
  const isDevanagariQuery = /[\u0900-\u097F]/.test(q);
  if (isDevanagariQuery) {
    // Strip diacritics for loose Hindi matching
    const qLoose = stripDiacritics(q);
    const looseMatch = searchableFields.some(field => {
      const fieldLoose = stripDiacritics(field);
      return fieldLoose.includes(qLoose);
    });
    if (looseMatch) return true;
  }

  return false;
};

/**
 * Flat number search — more strict, supports partial prefix match.
 * E.g.: "A-1" matches "A-101", "A-102" etc.
 * "101" matches "A-101", "B-101" etc.
 */
export const flatMatchesSearch = (flat_no, query) => {
  if (!query || !flat_no) return true;
  const q = query.toLowerCase().trim();
  const f = flat_no.toLowerCase();
  return f.includes(q) || f.replace('-', '').includes(q.replace('-', ''));
};
