const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Get all blogs
router.get('/', blogController.getBlogs);

// Get blogs by status
router.get('/status/:status', blogController.getBlogsByStatus);

// Get blog by ID
router.get('/id/:id', blogController.getBlogById);

// Get blog by slug
router.get('/slug/:slug', blogController.getBlogBySlug);

// Create new blog
router.post('/', blogController.createBlog);

// Update blog
router.put('/:id', blogController.updateBlog);

// Update blog status
router.patch('/:id/status', blogController.updateBlogStatus);

// Publish blog
router.patch('/:id/publish', blogController.publishBlog);

// Unpublish blog
router.patch('/:id/unpublish', blogController.unpublishBlog);

// Archive blog
router.patch('/:id/archive', blogController.archiveBlog);

// Unarchive blog
router.patch('/:id/unarchive', blogController.unarchiveBlog);

// Delete blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router; 
