const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { sendResponse, StatusCodes } = require('../utils/apiResponse');

// @desc    Get all published posts (public) with search & pagination
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const tag = req.query.tag || '';

    // Build query - only published posts for public view
    let query = { status: 'published' };

    // Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendResponse(res, StatusCodes.SUCCESS, {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug (public if published)
// @route   GET /api/posts/slug/:slug
// @access  Public
const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name email avatar bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
        options: { sort: { createdAt: -1 } },
      });

    if (!post) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
    }

    // If post is draft, only author or admin can view
    if (post.status === 'draft') {
      if (!req.user || (req.user._id.toString() !== post.author._id.toString() && req.user.role !== 'admin')) {
        return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
      }
    }

    return sendResponse(res, StatusCodes.SUCCESS, { post });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public/Private
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
        options: { sort: { createdAt: -1 } },
      });

    if (!post) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
    }

    return sendResponse(res, StatusCodes.SUCCESS, { post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
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

    const { title, content, excerpt, status, tags, featuredImage } = req.body;

    const post = await Post.create({
      title,
      content,
      excerpt,
      status: status || 'draft',
      tags: tags || [],
      featuredImage,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email avatar');

    return sendResponse(res, StatusCodes.CREATED, { post: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (owner or admin)
const updatePost = async (req, res, next) => {
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

    let post = await Post.findById(req.params.id);

    if (!post) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
    }

    // Check ownership: only author or admin can update
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, StatusCodes.FORBIDDEN, null, 'Not authorized to update this post');
    }

    const { title, content, excerpt, status, tags, featuredImage } = req.body;

    // If title changed, we need to save (to trigger slug regeneration)
    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
    post.status = status || post.status;
    post.tags = tags || post.tags;
    post.featuredImage = featuredImage !== undefined ? featuredImage : post.featuredImage;

    await post.save();

    const updatedPost = await Post.findById(post._id).populate('author', 'name email avatar');

    return sendResponse(res, StatusCodes.SUCCESS, { post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (owner or admin)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
    }

    // Check ownership: only author or admin can delete
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, StatusCodes.FORBIDDEN, null, 'Not authorized to delete this post');
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    await Post.findByIdAndDelete(req.params.id);

    return sendResponse(res, StatusCodes.SUCCESS, { message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle post status (publish/draft)
// @route   PATCH /api/posts/:id/status
// @access  Private (owner or admin)
const togglePostStatus = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, StatusCodes.FORBIDDEN, null, 'Not authorized to change post status');
    }

    post.status = post.status === 'published' ? 'draft' : 'published';
    await post.save();

    const updatedPost = await Post.findById(post._id).populate('author', 'name email avatar');

    return sendResponse(res, StatusCodes.SUCCESS, { post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posts
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';

    let query = { author: req.user._id };
    if (status) {
      query.status = status;
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendResponse(res, StatusCodes.SUCCESS, {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (admin only)
// @route   GET /api/posts/admin/all
// @access  Private (admin)
const getAllPostsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';
    const search = req.query.search || '';

    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendResponse(res, StatusCodes.SUCCESS, {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
  getMyPosts,
  getAllPostsAdmin,
};
