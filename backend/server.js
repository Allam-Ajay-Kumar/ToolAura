// server.js — Local development entry point
// For production, Firebase Functions uses index.js instead.

const connectDB = require('./config/db');
const app       = require('./app');

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health\n`);
});
