const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/contentController');

// Get all published content
router.get('/', contentController.getPublishedContent);

// Get published content by slug
router.get('/:slug', contentController.getPublishedContentBySlug);

// Get content by category
router.get('/category/:categorySlug', contentController.getPublishedContent);

// Get content by tag
router.get('/tag/:tagSlug', contentController.getPublishedContent);

module.exports = router; 
