const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Create a new comment
router.post('/', commentController.createComment);

// Get all comments (with filters)
router.get('/', commentController.getAllComments);

// Get comment by ID
router.get('/:id', commentController.getCommentById);

// Get comments by content ID
router.get('/content/:contentId', commentController.getContentComments);

// Update comment
router.put('/:id', commentController.updateComment);

// Delete comment
router.delete('/:id', commentController.deleteComment);

module.exports = router; 
