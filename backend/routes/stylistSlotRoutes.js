// routes/stylistSlotRoutes.js

const express = require('express');
const router = express.Router();
const stylistSlotController = require('../controllers/stylistSlotController');

// Define the route to fetch available slots for a stylist on a given date
router.get('/:stylistId/slots', stylistSlotController.getBookedSlots);

module.exports = router;
