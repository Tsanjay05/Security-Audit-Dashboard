const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB instance using the MONGO_URI environment variable.
 * Handles database connection events and errors.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code if connection fails during initial startup
    process.exit(1);
  }
};

module.exports = connectDB;
