const Booking = require('../models/Booking');
const Destination = require('../models/Destination');

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { destinationId, travelDate, numberOfPeople, specialRequests, contactPhone } = req.body;

    // Validate input
    if (!destinationId || !travelDate || !numberOfPeople || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Validate travel date is in the future
    if (new Date(travelDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Travel date must be in the future'
      });
    }

    // Calculate total price
    const totalPrice = destination.price * numberOfPeople;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      destination: destinationId,
      travelDate,
      numberOfPeople,
      totalPrice,
      specialRequests: specialRequests || '',
      contactPhone
    });

    // Populate destination details
    await booking.populate('destination', 'name location images price duration');

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Can only cancel pending/confirmed bookings
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`
      });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking };
