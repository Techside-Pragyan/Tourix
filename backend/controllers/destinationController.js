const Destination = require('../models/Destination');

// @desc    Get all destinations with search, filter, and pagination
// @route   GET /api/destinations
const getDestinations = async (req, res) => {
  try {
    const { search, category, state, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;

    // Build query object
    let query = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // State filter
    if (state && state !== 'All') {
      query.state = state;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { featured: -1, rating: -1 };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [destinations, total] = await Promise.all([
      Destination.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Destination.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: destinations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
const getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    res.json({ success: true, data: destination });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all unique categories
// @route   GET /api/destinations/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Destination.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all unique states
// @route   GET /api/destinations/states
const getStates = async (req, res) => {
  try {
    const states = await Destination.distinct('state');
    res.json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDestinations, getDestination, getCategories, getStates };
