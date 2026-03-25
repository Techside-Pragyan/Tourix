const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public - get reviews for destination
router.get('/:destinationId', getReviews);

// Protected - create and delete reviews
router.post('/:destinationId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
