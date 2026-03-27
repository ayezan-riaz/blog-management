// Standardized API Response Helper
// All responses follow: { success, statusCode, data/message }

const StatusCodes = {
  SUCCESS: 2000,
  CREATED: 2001,
  BAD_REQUEST: 4000,
  UNAUTHORIZED: 4001,
  FORBIDDEN: 4003,
  NOT_FOUND: 4004,
  CONFLICT: 4009,
  VALIDATION_ERROR: 4022,
  SERVER_ERROR: 5000,
};

// Map custom status codes to HTTP status codes
const httpStatusMap = {
  2000: 200,
  2001: 201,
  4000: 400,
  4001: 401,
  4003: 403,
  4004: 404,
  4009: 409,
  4022: 422,
  5000: 500,
};

const sendResponse = (res, statusCode, data = null, message = null) => {
  const httpStatus = httpStatusMap[statusCode] || 200;
  const success = statusCode >= 2000 && statusCode < 3000;

  const response = {
    success,
    statusCode,
  };

  if (success) {
    response.data = data;
  } else {
    response.message = message || 'An error occurred';
    if (data) response.data = data;
  }

  return res.status(httpStatus).json(response);
};

module.exports = { sendResponse, StatusCodes };
