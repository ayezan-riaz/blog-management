const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { sendResponse, StatusCodes } = require('../utils/apiResponse');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (admin)
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendResponse(res, StatusCodes.SUCCESS, {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Private (admin)
const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'author'].includes(role)) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, null, 'Invalid role. Must be admin or author');
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'User not found');
    }

    // Prevent admin from removing their own admin role
    if (req.user._id.toString() === req.params.id) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, null, 'Cannot change your own role');
    }

    user.role = role;
    await user.save();

    return sendResponse(res, StatusCodes.SUCCESS, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'User not found');
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, null, 'Cannot delete your own account');
    }

    // Delete all user's posts and associated comments
    const userPosts = await Post.find({ author: user._id });
    for (const post of userPosts) {
      await Comment.deleteMany({ post: post._id });
    }
    await Post.deleteMany({ author: user._id });

    // Delete all user's comments on other posts
    await Comment.deleteMany({ author: user._id });

    await User.findByIdAndDelete(req.params.id);

    return sendResponse(res, StatusCodes.SUCCESS, { message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (admin only)
// @route   GET /api/users/stats
// @access  Private (admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: 'published' });
    const draftPosts = await Post.countDocuments({ status: 'draft' });
    const totalComments = await Comment.countDocuments();

    // Recent posts
    const recentPosts = await Post.find()
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return sendResponse(res, StatusCodes.SUCCESS, {
      stats: {
        totalUsers,
        totalPosts,
        publishedPosts,
        draftPosts,
        totalComments,
      },
      recentPosts,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, changeUserRole, deleteUser, getDashboardStats };
