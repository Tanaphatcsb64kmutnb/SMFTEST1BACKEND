// db.js
const mongoose = require('mongoose');
require('dotenv').config(); // โหลด .env

const connection = mongoose.createConnection(process.env.MONGODB_URI)
  .on('open', () => {
    console.log("MongoDB connected");
  })
  .on('error', (err) => {
    console.log("MongoDB connection error:", err);
  });

module.exports = connection;
