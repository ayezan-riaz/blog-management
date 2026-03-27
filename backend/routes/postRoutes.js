const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
  getMyPosts,
  getAllPostsAdmin,
} = require('../controllers/postController');
const { getComments, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { roleAuth } = require('../middleware/roleAuth');
const { postValidation, commentValidation } = require('../utils/validators');

// Public routes
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);

// Protected routes (must come before /:id to avoid conflict)
router.get('/my-posts', protect, getMyPosts);
router.get('/admin/all', protect, roleAuth('admin'), getAllPostsAdmin);
router.post('/', protect, postValidation, createPost);

// Post-specific routes
router.get('/:id', getPostById);
router.put('/:id', protect, postValidation, updatePost);
router.delete('/:id', protect, deletePost);
router.patch('/:id/status', protect, togglePostStatus);

// Comment routes nested under posts
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, commentValidation, createComment);

module.exports = router;
