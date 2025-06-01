const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');

// Public routes
router.get('/', layoutController.getAllLayouts);
router.get('/type/:type', layoutController.getLayoutsByType);
router.get('/position/:position', layoutController.getLayoutsByPosition);
router.get('/:id', layoutController.getLayoutById);
router.get('/banners/active', layoutController.getActiveBanners);

// Admin routes
router.post('/', layoutController.createLayout);
router.put('/:id', layoutController.updateLayout);
router.delete('/:id', layoutController.deleteLayout);
router.put('/order', layoutController.updateLayoutOrder);
router.put('/:id/toggle-visibility', layoutController.toggleVisibility);
router.put('/:id/display-period', layoutController.setDisplayPeriod);
router.put('/banners/group-order', layoutController.updateGroupOrder);

module.exports = router; 
