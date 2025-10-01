const express = require('express');
const router = express.Router();

// Import routes
const contentRoutes = require('./contentRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const commentRoutes = require('./commentRoutes');
const settingRoutes = require('./settingRoutes');
const layoutRoutes = require('./layoutRoutes');
const mediaRoutes = require('./mediaRoutes');
const headerRoutes = require('./headerRoutes');
const footerRoutes = require('./footerRoutes');
const blogRoutes = require('./blogRoutes');

// Mount routes
router.use('/contents', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes);
router.use('/settings', settingRoutes);
router.use('/layouts', layoutRoutes);
router.use('/media', mediaRoutes);
router.use('/header', headerRoutes);
router.use('/footer', footerRoutes);
router.use('/blogs', blogRoutes);

module.exports = router; 
