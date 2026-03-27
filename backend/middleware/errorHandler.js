const { sendResponse, StatusCodes } = require('../utils/apiResponse');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendResponse(res, StatusCodes.VALIDATION_ERROR, null, messages.join(', '));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendResponse(
      res,
      StatusCodes.CONFLICT,
      null,
      `Duplicate value for '${field}'. This ${field} already exists.`
    );
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Resource not found');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'Token expired');
  }

  // Default server error
  return sendResponse(
    res,
    StatusCodes.SERVER_ERROR,
    null,
    err.message || 'Internal Server Error'
  );
};

module.exports = { errorHandler };
