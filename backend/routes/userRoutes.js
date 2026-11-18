// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  getMySubmissions,
  getMyFavourites,
  addToFavourites,
  removeFromFavourites,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.get('/submissions', protect, getMySubmissions);
router.get('/favourites', protect, getMyFavourites);
router.post('/favourites/:toolId', protect, addToFavourites);
router.delete('/favourites/:toolId', protect, removeFromFavourites);

module.exports = router;
