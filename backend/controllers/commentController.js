const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { sendResponse, StatusCodes } = require('../utils/apiResponse');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    return sendResponse(res, StatusCodes.SUCCESS, { comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
const createComment = async (req, res, next) => {
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

    const { postId } = req.params;
    const { content } = req.body;

    // Verify post exists and is published
    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Post not found');
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name avatar'
    );

    return sendResponse(res, StatusCodes.CREATED, { comment: populatedComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (comment author or admin)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return sendResponse(res, StatusCodes.NOT_FOUND, null, 'Comment not found');
    }

    // Check if user is the comment author or admin
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return sendResponse(
        res,
        StatusCodes.FORBIDDEN,
        null,
        'Not authorized to delete this comment'
      );
    }

    await Comment.findByIdAndDelete(req.params.id);

    return sendResponse(res, StatusCodes.SUCCESS, { message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, createComment, deleteComment };
