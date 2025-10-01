const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// Public routes
router.get('/', tagController.getAllTags);
router.get('/:id', tagController.getTagById);
router.get('/slug/:slug', tagController.getTagBySlug);

// Admin routes
router.post('/', tagController.createTag);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router; 