const express = require('express');
const { loginAdmin, getAdminProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', protect, getAdminProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
