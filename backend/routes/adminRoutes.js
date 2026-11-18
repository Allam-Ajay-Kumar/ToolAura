// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getPendingSubmissions,
  reviewSubmission,
  createToolDirectly,
  getAllTools,
  updateTool,
  deleteTool,
  getAllUsers,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboardStats);
router.get('/submissions', getPendingSubmissions);
router.patch('/submissions/:id/status', reviewSubmission);
router.get('/tools', getAllTools);
router.post('/tools', createToolDirectly);
router.put('/tools/:id', updateTool);
router.delete('/tools/:id', deleteTool);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);

module.exports = router;
