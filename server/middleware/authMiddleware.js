import jwt from 'jsonwebtoken';
import { queries } from '../models/queries.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_change_me_in_production');
      
      // Fetch user profile and attach to request
      const user = await queries.findUserById(decoded.id);
      
      if (!user) {
        res.status(401);
        throw new Error('User not found or account deactivated');
      }

      // Attach user object (excluding password hash) to req
      const { password_hash, ...safeUser } = user;
      req.user = safeUser;
      
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(401);
      next(new Error('Not authorized, token validation failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};

// Enforce Role-Based Access Control
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, credentials missing'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Access Denied: Role '${req.user.role}' is not authorized to access this resource`));
    }

    next();
  };
};
