const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');

// ===== PUBLIC ROUTES =====
// Banner routes
router.get('/banners/active', layoutController.getActiveBanners);
router.get('/banners/homepage', layoutController.getHomepageBanner);
router.get('/banners/all-raw', layoutController.getAllBannersRaw);
router.get('/banners/position/:position', layoutController.getBannersByPosition);

// Layout routes
router.get('/', layoutController.getAllLayouts);
router.get('/type/:type', layoutController.getLayoutsByType);
router.get('/position/:position', layoutController.getLayoutsByPosition);
router.get('/:id', layoutController.getLayoutById);

// ===== ADMIN ROUTES =====
// Banner management
router.put('/banners/group-order', layoutController.updateGroupOrder);

// Layout management
router.put('/order', layoutController.updateLayoutOrder);

// Layout CRUD
router.post('/', layoutController.createLayout);
router.put('/:id', layoutController.updateLayout);
router.delete('/:id', layoutController.deleteLayout);
router.put('/:id/toggle-visibility', layoutController.toggleVisibility);
router.put('/:id/display-period', layoutController.setDisplayPeriod);

module.exports = router; 
