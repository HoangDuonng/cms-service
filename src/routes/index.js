const express = require('express');
const router = express.Router();

// Import routes
const contentRoutes = require('./contentRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const commentRoutes = require('./commentRoutes');
const settingRoutes = require('./settingRoutes');
const layoutRoutes = require('./layoutRoutes');

// Mount routes
router.use('/contents', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes);
router.use('/settings', settingRoutes);
router.use('/layouts', layoutRoutes);

module.exports = router; 
