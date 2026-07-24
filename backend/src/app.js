const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Configure JSON body parser with increased limit to support bulk upload of 10,000 records
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use(requestLogger);

// Mount API routes
app.use('/api', logRoutes);

// Base Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Fallback route handler for undefined paths (404 Not Found)
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

// Global central error handler middleware
app.use(errorHandler);

module.exports = app;
