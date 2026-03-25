const express = require('express');
const router = express.Router();
const { getDestinations, getDestination, getCategories, getStates } = require('../controllers/destinationController');

// Public routes - no auth needed
router.get('/categories', getCategories);
router.get('/states', getStates);
router.get('/', getDestinations);
router.get('/:id', getDestination);

module.exports = router;
