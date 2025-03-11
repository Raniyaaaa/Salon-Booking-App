const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Route to create a booking and initiate a payment
router.post("/create-payment", paymentController.createPayment);

// Route to verify payment and update booking
router.post("/verify-payment", paymentController.verifyPayment);

module.exports = router;
