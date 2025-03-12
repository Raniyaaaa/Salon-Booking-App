const express = require("express");
const router = express.Router();
const stylistController = require("../controllers/stylistController");

router.get("/", stylistController.getStylists);
router.post("/", stylistController.addStylist);
router.put("/:id", stylistController.updateStylist);
router.delete("/:id", stylistController.deleteStylist);

module.exports = router;
