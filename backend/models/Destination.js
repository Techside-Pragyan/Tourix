const mongoose = require('mongoose');

// Destination Schema - stores tourist destination information
const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    enum: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Puducherry', 'Goa'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Beach', 'Hill Station', 'Heritage', 'Wildlife', 'Temple', 'Backwaters', 'Waterfall', 'City', 'Adventure', 'Culture']
  },
  duration: {
    type: String,
    default: '3 Days / 2 Nights'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  highlights: [{
    type: String
  }],
  included: [{
    type: String
  }],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestTimeToVisit: {
    type: String,
    default: 'October to March'
  },
  maxGroupSize: {
    type: Number,
    default: 15
  }
}, {
  timestamps: true
});

// Text index for search functionality
destinationSchema.index({ name: 'text', location: 'text', description: 'text', state: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
