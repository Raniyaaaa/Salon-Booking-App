const express = require('express');
const router = express.Router();
const stylistSlotController = require('../controllers/stylistSlotController');

router.get('/:stylistId/slots', stylistSlotController.getBookedSlots);

module.exports = router;
