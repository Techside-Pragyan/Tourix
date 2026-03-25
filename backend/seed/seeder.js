const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Destination = require('../models/Destination');
const destinations = require('./destinations');

// Seed the database with destination data
const seedDB = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('🗑️  Cleared existing destinations');

    // Insert seed data
    const inserted = await Destination.insertMany(destinations);
    console.log(`✅ Successfully seeded ${inserted.length} destinations`);

    // Log summary
    const categories = await Destination.distinct('category');
    const states = await Destination.distinct('state');
    console.log(`📊 Categories: ${categories.join(', ')}`);
    console.log(`🗺️  States: ${states.join(', ')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
