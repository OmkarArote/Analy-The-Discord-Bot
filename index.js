const { connectToDB } = require('./db/connection');
require('dotenv').config();

// Connect to MongoDB
connectToDB();

// Start Discord Bot
require('./src/bot');