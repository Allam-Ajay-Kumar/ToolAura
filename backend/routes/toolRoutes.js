// routes/toolRoutes.js

const express = require('express');
const router = express.Router();
const { getApprovedTools, getToolById, submitTool } = require('../controllers/toolController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getApprovedTools);
router.get('/:id', getToolById);
router.post('/submit', protect, submitTool);

module.exports = router;
