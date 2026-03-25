const mongoose = require('mongoose');

// Booking Schema - stores user trip bookings
const bookingSchema = new mongoose.Schema({
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
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Number of people is required'],
    min: [1, 'At least 1 person required'],
    max: [20, 'Maximum 20 people per booking']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  specialRequests: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid'
  }
}, {
  timestamps: true
});

// Populate user and destination on queries
bookingSchema.pre(/^find/, function(next) {
  this.populate('destination', 'name location images price duration');
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
