const morgan = require('morgan');

// Using Morgan middleware with the 'dev' format to log HTTP requests in development
const requestLogger = morgan('dev');

module.exports = requestLogger;
