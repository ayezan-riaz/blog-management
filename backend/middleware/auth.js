const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse, StatusCodes } = require('../utils/apiResponse');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'User not found');
    }

    next();
  } catch (error) {
    return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'Not authorized, token invalid');
  }
};

module.exports = { protect };
