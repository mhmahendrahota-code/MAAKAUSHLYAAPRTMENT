/**
 * @file formatters.js
 * @description Consistent date, number, and currency formatting for Maa Kaushalya RWA.
 * 
 * SOLVES: Mixed date formats across pages, inconsistent currency display,
 * and Hindi/English number format conflicts.
 * 
 * RULE: Use these helpers everywhere — never use raw toLocaleDateString() inline.
 */

// ─────────────────────────────────────────────────────────────────────────────
// DATE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard short date: "5 जून 2026"
 * Use for: move-in dates, registered dates
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Short date with English month: "5 Jun 2026"
 * Use for: admin tables where space is limited
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Date + Time: "5 जून 2026, 10:30 AM"
 * Use for: transaction timestamps, audit logs
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

/**
 * Relative time: "2 दिन पहले", "3 महीने पहले"
 * Use for: "Registered X days ago" in member cards
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'आज';
    if (diffDays === 1) return 'कल';
    if (diffDays < 7) return `${diffDays} दिन पहले`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} सप्ताह पहले`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} महीने पहले`;
    return `${Math.floor(diffDays / 365)} वर्ष पहले`;
  } catch {
    return '—';
  }
};

/**
 * Duration remaining: "45 दिन शेष", "समय समाप्त"
 * Use for: lease expiry countdown
 */
export const formatTimeRemaining = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    const diffMs = d - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'लीज़ समाप्त', color: 'text-red-400', urgent: true };
    if (diffDays <= 30) return { label: `${diffDays} दिन शेष`, color: 'text-amber-400', urgent: true };
    if (diffDays <= 90) return { label: `${diffDays} दिन शेष`, color: 'text-yellow-400', urgent: false };
    const months = Math.floor(diffDays / 30);
    return { label: `${months} माह शेष`, color: 'text-emerald-400', urgent: false };
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CURRENCY FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Indian currency format: "₹1,25,000"
 * Use for: all monetary amounts in the system
 */
export const formatCurrency = (amount, showPaise = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showPaise ? 2 : 0,
      maximumFractionDigits: showPaise ? 2 : 0,
    }).format(Number(amount));
  } catch {
    return `₹${amount}`;
  }
};

/**
 * Short currency: "₹1.25L", "₹50K"
 * Use for: stat cards, compact displays
 */
export const formatCurrencyShort = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  const n = Number(amount);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// NUMBER FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Indian number format with commas: "1,25,000"
 */
export const formatNumber = (n) => {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(Number(n));
};

// ─────────────────────────────────────────────────────────────────────────────
// PHONE FORMATTING — for display only
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Display phone: "+91 98765 43210"
 */
export const formatPhoneDisplay = (phone) => {
  if (!phone) return '—';
  const stripped = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '');
  if (stripped.length === 10) {
    return `+91 ${stripped.slice(0, 5)} ${stripped.slice(5)}`;
  }
  return phone;
};

/**
 * Masked phone for privacy: "XXXXXX3210"
 */
export const maskPhone = (phone) => {
  if (!phone) return '—';
  const stripped = phone.replace(/[^0-9]/g, '');
  return 'XXXXXX' + stripped.slice(-4);
};

// ─────────────────────────────────────────────────────────────────────────────
// FLAT NUMBER UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Alphanumeric sort comparator for flat numbers.
 * Correctly orders: A-101 < A-102 < B-101 < B-102
 */
export const compareFlatNumbers = (a, b) => {
  if (!a && b) return 1;
  if (a && !b) return -1;
  if (!a && !b) return 0;
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
};

/**
 * Extracts building block and unit from flat number.
 * "A-101" → { block: 'A', unit: 101 }
 */
export const parseFlatNumber = (flatNo) => {
  if (!flatNo) return { block: '', unit: 0 };
  const parts = flatNo.split('-');
  return {
    block: parts[0] || '',
    unit: parseInt(parts[1] || '0', 10),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// CSV EXPORT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wraps a string for safe CSV output.
 * Handles commas, quotes, newlines in values.
 * Works with Hindi text in Excel (UTF-8 BOM is added separately).
 */
export const csvEscape = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains comma, quote, or newline → wrap in quotes and escape inner quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || /[\u0900-\u097F]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Creates a CSV string with UTF-8 BOM prefix for Hindi compatibility in Excel.
 * @param {string[]} headers - Column headers
 * @param {string[][]} rows - Data rows
 */
export const buildCsvContent = (headers, rows) => {
  const BOM = '\uFEFF'; // UTF-8 BOM — critical for Hindi in Excel
  const headerRow = headers.map(csvEscape).join(',');
  const dataRows = rows.map(row => row.map(csvEscape).join(','));
  return BOM + [headerRow, ...dataRows].join('\n');
};
