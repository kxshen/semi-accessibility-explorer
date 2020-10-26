const mongoose = require('mongoose');
const mongodb = require('mongodb');
require("dotenv").config();

// Mongo database URL + password hidden in .env file
const db = process.env.MONGO_URL

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true , useUnifiedTopology: true })

// Error control
var connection = mongoose.connection;
connection.on('connected', function() {
  console.log('-----------------');
  console.log('MongoDB connected');
  console.log('-----------------');
});

connection.on('disconnected', function() {
  console.log('-----------------');
  console.log('Disconnected from MongoDB');
  console.log('-----------------');
});

connection.on('error', function(error) {
    console.log('db connection error', error);
});

process.on('SIGINT', function() {
    connection.close(function() {
      console.log('-----------------');
      console.log('MongoDB connection closed due to process termination');
      console.log('-----------------');
      process.exit(0);
    });
});

module.exports = connection;