const express = require('express');
const router = express.Router();
const { deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Delete a comment (comment author or admin)
router.delete('/:id', protect, deleteComment);

module.exports = router;
