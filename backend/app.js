// app.js — Express app setup (no app.listen here)
// Used by both server.js (local dev) and index.js (Firebase Functions)

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// CORS — allow Firebase Hosting origin + localhost for local dev
const allowedOrigins = [
  'http://localhost:5173',
  'https://tools-aura-04.web.app',
  'https://tools-aura-04.firebaseapp.com',
  'https://tool-aura-backend-production.up.railway.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/tools',      require('./routes/toolRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users',      require('./routes/userRoutes'));
app.use('/api/admin',      require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tool Aura API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;

