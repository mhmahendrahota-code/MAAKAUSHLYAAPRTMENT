# Quick Fix Checklist - Security Issues

## 🔴 CRITICAL FIXES (Fix Before Any Production Deployment)

### [ ] 1. JWT Secret - authMiddleware.js & authController.js
```bash
# Remove fallback: 'super_secret_key_change_me_in_production'
# Require JWT_SECRET in .env
```

### [ ] 2. Remove Client Mock Credentials - AuthContext.jsx
```bash
# Remove hardcoded admin/resident credentials
# Remove offline mock login feature entirely
# Show error when backend unavailable instead
```

### [ ] 3. CORS Fix - server.js
```bash
# Change: origin: '*' 
# To: origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
```

### [ ] 4. Secure Token Storage - AuthContext.jsx
```bash
# Move from localStorage to httpOnly cookie (backend must set)
# Remove sensitive user data from localStorage
# Implement proper session management
```

### [ ] 5. Input Validation - All Controllers
```bash
# Add zod or joi validation schemas
# Validate all request inputs before database queries
# Implement length limits on string fields
```

### [ ] 6. Filter PII from Directory - userController.js
```bash
# Remove: aadhaar_number, family_member_names, vehicles, phone, email
# Keep only: id, name, flat_no
```

### [ ] 7. Filter PII from Login Response - authController.js
```bash
# Remove: aadhaar_number, family_member_names, vehicles, owner_phone
# Keep only: id, name, email, role, flat_no, gender
```

### [ ] 8. Add Rate Limiting - authRoutes.js
```bash
# npm install express-rate-limit
# Add rate limiter to /register and /login endpoints
# Max 5 attempts per 15 minutes
```

---

## 🟠 HIGH PRIORITY FIXES (Before Production)

### [ ] 9. Remove Hardcoded Test Credentials - db.js
```bash
# Remove test user data from mock database
# Use environment variables for test data if needed
```

### [ ] 10. Add HTTPS Enforcement - server.js
```bash
# npm install helmet
# Add HTTPS redirect in production
# Set HSTS header
```

### [ ] 11. Add Security Headers - server.js
```bash
# npm install helmet
# Add CSP, X-Frame-Options, X-Content-Type-Options headers
```

### [ ] 12. Reduce Payload Limit - server.js
```bash
# Change: limit: '10mb' → limit: '1mb'
# Add general rate limiter: 100 requests per 15 minutes
```

### [ ] 13. Improve Error Logging - errorMiddleware.js
```bash
# Don't expose stack traces to client in production
# Log detailed errors server-side only
# Use structured logging with request ID
```

### [ ] 14. Add Authorization Middleware - billRoutes.js
```bash
# Create verifyResourceOwnership middleware
# Verify users can only access their own data
```

### [ ] 15. Implement Audit Logging
```bash
# Create audit_logs table in database
# Log: login, authorization checks, data modifications
# Log admin actions with timestamps
```

### [ ] 16. Remove Default Password - Directory.jsx
```bash
# Generate random password for new users
# Force password change on first login
```

### [ ] 17. Add Password Change Enforcement
```bash
# Add is_default_password flag to users table
# Block access until password is changed
# Implement password expiration policy
```

### [ ] 18. Implement CSRF Protection
```bash
# npm install csurf
# Add CSRF token to all state-changing operations
# Validate token on server
```

---

## 🟡 MEDIUM PRIORITY FIXES (Plan for next sprint)

### [ ] 19. Pin Dependency Versions
```bash
# Remove ^ and ~ from package.json
# Use exact versions
# Establish update process
```

### [ ] 20. Validate Environment Variables
```bash
# Create startup validation for required env vars
# Exit process if missing critical variables
# Log which variables are loaded
```

### [ ] 21. Add Request ID Tracking
```bash
# npm install uuid
# Add X-Request-ID to all requests
# Use in logging for traceability
```

### [ ] 22. Add Data Validation Schemas
```bash
# Create validation schemas for all operations
# Validate email format, phone format, etc.
# Prevent corrupted data in database
```

### [ ] 23. Add Graceful Offline Handling
```bash
# Show "offline" message when backend unavailable
# Don't allow fake login as "solution"
# Disable certain features gracefully
```

### [ ] 24. Filter Directory by Role
```bash
# Admins: see all details
# Residents: see only flat_no and name
# Security: see limited information
```

---

## 🔵 LOW PRIORITY FIXES (Nice to have)

### [ ] 25. Add Swagger Documentation
```bash
# npm install swagger-jsdoc swagger-ui-express
# Document all endpoints
# Add to /api-docs route
```

### [ ] 26. Add Pagination for Large Datasets
```bash
# Limit default query results to 50
# Add page/limit parameters
# Add database indexes for common queries
```

---

## Environment Variables Required

Create `.env` file:
```env
# CRITICAL
JWT_SECRET=your-super-secure-random-secret-min-32-chars
DATABASE_URL=postgresql://user:password@localhost:5432/apartment_db

# IMPORTANT
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# OPTIONAL
LOG_LEVEL=info
SESSION_TIMEOUT=7d
```

---

## Testing Checklist

- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials (should fail)
- [ ] Test accessing protected routes without token (should fail)
- [ ] Test accessing routes with expired token (should fail)
- [ ] Test CORS from different origin (should fail)
- [ ] Test rate limiting on login (should block after 5 attempts)
- [ ] Test directory endpoint doesn't expose PII
- [ ] Test user can only access their own bills
- [ ] Test admin can access all bills
- [ ] Test SQL injection attempts (should be blocked)
- [ ] Test XSS attempts in title/description fields
- [ ] Verify token is not in localStorage
- [ ] Verify HTTPS redirect in production
- [ ] Verify security headers are set

---

## Deployment Checklist

- [ ] All critical issues fixed
- [ ] .env file configured with secure values
- [ ] JWT_SECRET is strong (32+ chars, random)
- [ ] Database backed up before migration
- [ ] HTTPS certificate installed
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Audit logging working
- [ ] Monitoring/alerting set up
- [ ] Incident response plan documented
- [ ] Team trained on security policies

---

**Estimated time to fix all CRITICAL issues:** 16-24 hours  
**Estimated time to fix all HIGH issues:** 24-32 hours  
**Estimated time to fix all MEDIUM issues:** 16-24 hours  

**Total estimated effort:** 56-80 hours of focused security work
