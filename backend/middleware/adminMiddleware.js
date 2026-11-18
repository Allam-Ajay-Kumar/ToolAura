// middleware/adminMiddleware.js
// Checks if the authenticated user has the 'admin' role
// Must be used AFTER the protect middleware

const adminOnly = (req, res, next) => {
  // req.user is set by the protect middleware
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, allow the request to proceed
  } else {
    res.status(403); // 403 Forbidden (authenticated but not authorized)
    throw new Error('Access denied. Admin privileges required.');
  }
};

module.exports = { adminOnly };
