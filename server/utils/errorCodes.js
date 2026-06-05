/**
 * @file errorCodes.js
 * @description Centralized error codes for Maa Kaushalya RWA backend.
 * 
 * SOLVES:
 * 1. Hindi error messages garbled in Windows terminal (PowerShell encoding issue)
 * 2. Frontend can't reliably parse Hindi error messages to show different UI
 * 3. i18n — same error code, different language message on frontend
 * 
 * PATTERN: Backend throws error codes (ASCII-safe), 
 *          Frontend maps codes → bilingual display messages.
 * 
 * ERROR FORMAT: ERR_CATEGORY_DESCRIPTION
 */

export const ERROR_CODES = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  ERR_USER_EXISTS:              'ERR_USER_EXISTS',
  ERR_INVALID_ROLE:             'ERR_INVALID_ROLE',
  ERR_INVALID_CREDENTIALS:      'ERR_INVALID_CREDENTIALS',
  ERR_ACCOUNT_PENDING:          'ERR_ACCOUNT_PENDING',
  ERR_ACCOUNT_REJECTED:         'ERR_ACCOUNT_REJECTED',
  ERR_REQUIRED_FIELDS:          'ERR_REQUIRED_FIELDS',
  ERR_WEAK_PASSWORD:            'ERR_WEAK_PASSWORD',

  // ── Flat / Resident ───────────────────────────────────────────────────────
  ERR_FLAT_TENANT_EXISTS:       'ERR_FLAT_TENANT_EXISTS',
  ERR_FLAT_OWNER_EXISTS:        'ERR_FLAT_OWNER_EXISTS',
  ERR_FLAT_SELF_OCCUPIED:       'ERR_FLAT_SELF_OCCUPIED',
  ERR_FLAT_TENANT_CONFLICT:     'ERR_FLAT_TENANT_CONFLICT',
  ERR_FLAT_REQUIRED:            'ERR_FLAT_REQUIRED',

  // ── Vehicles ──────────────────────────────────────────────────────────────
  ERR_VEHICLE_LIMIT:            'ERR_VEHICLE_LIMIT',
  ERR_CAR_LIMIT:                'ERR_CAR_LIMIT',
  ERR_BIKE_LIMIT:               'ERR_BIKE_LIMIT',

  // ── General ───────────────────────────────────────────────────────────────
  ERR_NOT_FOUND:                'ERR_NOT_FOUND',
  ERR_UNAUTHORIZED:             'ERR_UNAUTHORIZED',
  ERR_FORBIDDEN:                'ERR_FORBIDDEN',
  ERR_SERVER:                   'ERR_SERVER',
};

/**
 * Creates a structured error object.
 * Used in controllers: throw createError(ERROR_CODES.ERR_USER_EXISTS, 400);
 * 
 * @param {string} code - Error code from ERROR_CODES
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} [details] - Optional English-only debug details (for logs)
 */
export const createError = (code, statusCode = 400, details = null) => {
  const err = new Error(code);
  err.errorCode = code;
  err.statusCode = statusCode;
  if (details) err.details = details;
  return err;
};

/**
 * English fallback messages for server-side logging (terminal safe — no Hindi).
 * These are NEVER sent to the client — only used in console.error().
 */
export const LOG_MESSAGES = {
  ERR_USER_EXISTS:          'Registration failed: email already registered',
  ERR_INVALID_ROLE:         'Registration failed: invalid role specified',
  ERR_INVALID_CREDENTIALS:  'Login failed: email/password mismatch',
  ERR_ACCOUNT_PENDING:      'Login failed: account pending admin approval',
  ERR_ACCOUNT_REJECTED:     'Login failed: account has been rejected',
  ERR_REQUIRED_FIELDS:      'Validation failed: required fields missing',
  ERR_WEAK_PASSWORD:        'Validation failed: password too short',
  ERR_FLAT_TENANT_EXISTS:   'Flat conflict: tenant already registered for this flat',
  ERR_FLAT_OWNER_EXISTS:    'Flat conflict: owner already registered for this flat',
  ERR_FLAT_SELF_OCCUPIED:   'Flat conflict: self-occupied owner already registered',
  ERR_FLAT_TENANT_CONFLICT: 'Flat conflict: cannot register self-occupied when tenant exists',
  ERR_VEHICLE_LIMIT:        'Vehicle limit exceeded: max 3 vehicles per flat',
  ERR_CAR_LIMIT:            'Vehicle limit exceeded: max 1 car per flat',
  ERR_BIKE_LIMIT:           'Vehicle limit exceeded: max 2 bikes per flat',
  ERR_NOT_FOUND:            'Resource not found',
  ERR_UNAUTHORIZED:         'Unauthorized access attempt',
  ERR_FORBIDDEN:            'Forbidden: insufficient permissions',
  ERR_SERVER:               'Internal server error',
};
