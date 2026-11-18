// middleware/errorMiddleware.js
// Global error handling middleware

// Handle 404 - Route Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Handle all other errors
const errorHandler = (err, req, res, next) => {
  // Sometimes Express sets status 200 even on errors, so we correct it
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Show stack trace only during development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
