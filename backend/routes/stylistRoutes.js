const express = require("express");
const router = express.Router();
const stylistController = require("../controllers/stylistController");

// 🔹 Fetch all stylists
router.get("/", stylistController.getStylists);

// 🔹 Add a new stylist
router.post("/", stylistController.addStylist);

// 🔹 Update a stylist
router.put("/:id", stylistController.updateStylist);

// 🔹 Delete a stylist
router.delete("/:id", stylistController.deleteStylist);

module.exports = router;
