const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Public routes
router.get('/published', contentController.getPublishedContent);
router.get('/published/:slug', contentController.getPublishedContentBySlug);

// Admin routes
router.post('/', contentController.createContent);
router.get('/', contentController.getAllContent);
router.get('/:id', contentController.getContentById);
router.get('/slug/:slug', contentController.getContentBySlug);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

module.exports = router; 
