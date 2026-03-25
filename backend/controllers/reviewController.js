const Review = require('../models/Review');

// @desc    Get reviews for a destination
// @route   GET /api/reviews/:destinationId
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ destination: req.params.destinationId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a review
// @route   POST /api/reviews/:destinationId
const createReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating, title, and comment'
      });
    }

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      user: req.user._id,
      destination: req.params.destinationId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this destination'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      destination: req.params.destinationId,
      rating: Number(rating),
      title,
      comment
    });

    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Verify the review belongs to the user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getReviews, createReview, deleteReview };
