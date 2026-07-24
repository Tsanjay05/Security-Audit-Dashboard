// Load environment variables from .env file
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Initializes database connection and starts the HTTP server.
 */
const startServer = async () => {
  // Connect to MongoDB database
  await connectDB();

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
