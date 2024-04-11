// Getting env variables
require('dotenv').config();
const { MONGODB_URI : uri = '' } = process.env;

// Setting up the required libs
const { MongoClient } = require('mongodb');

// Setting up client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

module.exports = { connectToDB, client };
