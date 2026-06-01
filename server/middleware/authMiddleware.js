import jwt from 'jsonwebtoken';
import { queries } from '../models/queries.js';

export const protect = async (req, res, next) => {
  let token;

  // Retrieve token from httpOnly cookie or Authorization header
  token = req.cookies?.auth_token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const bearerToken = req.headers.authorization.split(' ')[1];
    if (bearerToken && bearerToken !== 'null' && bearerToken !== 'undefined' && bearerToken !== '') {
      token = bearerToken;
    }
  }
  if (!token || token === 'null' || token === 'undefined') {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
  try {
    // Verify JWT token using required secret
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is missing');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
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
      return next(new Error('Not authorized, token validation failed'));
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
