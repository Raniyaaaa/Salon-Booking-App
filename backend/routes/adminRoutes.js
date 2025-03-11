const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin routes
router.get('/users', authMiddleware, adminController.getUsers);
router.post('/manage-booking', authMiddleware, adminController.manageBooking);

module.exports = router;
