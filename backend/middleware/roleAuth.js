const { sendResponse, StatusCodes } = require('../utils/apiResponse');

// Role-based authorization middleware
// Usage: roleAuth('admin') or roleAuth('admin', 'author')
const roleAuth = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      return sendResponse(
        res,
        StatusCodes.FORBIDDEN,
        null,
        `Role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};

module.exports = { roleAuth };
