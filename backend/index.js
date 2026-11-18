// index.js — Firebase Cloud Functions entry point
// This wraps the Express app as a Firebase HTTPS function called "api".
// All requests to /api/** on Firebase Hosting are rewritten to this function.

const functions  = require('firebase-functions');
const connectDB  = require('./config/db');
const app        = require('./app');

// Connect to MongoDB Atlas once (persists across warm function invocations)
connectDB();

// Export the Express app as a Firebase Cloud Function named "api"
exports.api = functions.https.onRequest(app);

