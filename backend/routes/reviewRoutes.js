const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/review', authMiddleware, reviewController.leaveReview);
router.get('/reviews/:serviceId', reviewController.getReviews);

module.exports = router;
