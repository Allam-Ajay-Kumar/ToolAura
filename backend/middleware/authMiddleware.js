// middleware/authMiddleware.js
// Verifies the JWT token sent in the Authorization header

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // JWT tokens are sent in the Authorization header as:
  // Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user object to req so controllers can access it
      // We exclude the password field for security
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error('Your account has been deactivated');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

module.exports = { protect };
