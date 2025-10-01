const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// Public routes
router.get('/', settingController.getSettings);

// Admin routes
router.put('/', settingController.updateSettings);
router.patch('/', settingController.updatePartialSettings);

module.exports = router; 
