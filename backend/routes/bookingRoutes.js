const express = require('express');
const router = express.Router();
const { getUserAppointments, cancelAppointment } = require('../controllers/bookingController');
const authMiddleware = require("../middleware/authMiddleware");


router.get("/mybookings", authMiddleware, getUserAppointments);
router.delete("/:id", cancelAppointment);
module.exports = router;
