const express = require('express');
const router = express.Router();
const { bookAppointment } = require('../controllers/bookingController');

// Route to book an appointment
router.post('/', bookAppointment);

module.exports = router;
