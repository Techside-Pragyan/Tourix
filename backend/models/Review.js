const mongoose = require('mongoose');

// Review Schema - stores user reviews for destinations
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: [true, 'Destination reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Ensure one review per user per destination
reviewSchema.index({ user: 1, destination: 1 }, { unique: true });

// Static method to calculate average rating for a destination
reviewSchema.statics.calcAverageRating = async function(destinationId) {
  const stats = await this.aggregate([
    { $match: { destination: destinationId } },
    {
      $group: {
        _id: '$destination',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Destination').findByIdAndUpdate(destinationId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model('Destination').findByIdAndUpdate(destinationId, {
      rating: 0,
      totalReviews: 0
    });
  }
};

// Update destination rating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.destination);
});

// Update destination rating after delete
reviewSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    doc.constructor.calcAverageRating(doc.destination);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
