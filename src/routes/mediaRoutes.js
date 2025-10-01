const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

// Upload media
router.post('/upload', mediaController.uploadMedia);

// Get all media
router.get('/', mediaController.getAllMedia);

// Get media by ID
router.get('/:id', mediaController.getMediaById);

// Delete media
router.delete('/:id', mediaController.deleteMedia);

// Get video banners
router.get('/banners/videos', mediaController.getVideoBanners);

// Get banner media (images and videos)
router.get('/banners/all', mediaController.getBannerMedia);

// Update media metadata
router.patch('/:id/metadata', mediaController.updateMediaMetadata);

module.exports = router; 
