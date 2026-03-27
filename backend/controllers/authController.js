const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendResponse, StatusCodes } = require('../utils/apiResponse');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        StatusCodes.VALIDATION_ERROR,
        { errors: errors.array() },
        errors.array().map((e) => e.msg).join(', ')
      );
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, StatusCodes.CONFLICT, null, 'User with this email already exists');
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = user.generateToken();

    return sendResponse(res, StatusCodes.CREATED, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        StatusCodes.VALIDATION_ERROR,
        { errors: errors.array() },
        errors.array().map((e) => e.msg).join(', ')
      );
    }

    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'Invalid email or password');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendResponse(res, StatusCodes.UNAUTHORIZED, null, 'Invalid email or password');
    }

    // Generate token
    const token = user.generateToken();

    return sendResponse(res, StatusCodes.SUCCESS, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return sendResponse(res, StatusCodes.SUCCESS, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        StatusCodes.VALIDATION_ERROR,
        { errors: errors.array() },
        errors.array().map((e) => e.msg).join(', ')
      );
    }

    const { name, bio, avatar } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, StatusCodes.SUCCESS, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
