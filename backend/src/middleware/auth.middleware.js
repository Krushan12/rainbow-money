import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check token in Bearer header and cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id)
      .select('-password')
      .select('+active');

    if (!user || !user.active) {
      res.status(401);
      throw new Error('User no longer exists');
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      res.status(401);
      throw new Error('User recently changed password. Please log in again');
    }

    // Check if token is in user's valid tokens
    const tokenExists = user.tokens.some(t => t.token === token);
    if (!tokenExists) {
      res.status(401);
      throw new Error('Token is no longer valid');
    }

    // Grant access
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401);
      throw new Error('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401);
      throw new Error('Token has expired');
    }
    throw error;
  }
});

// Restrict access to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission to perform this action');
    }
    next();
  };
};
