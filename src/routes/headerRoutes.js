const express = require('express');
const router = express.Router();
const headerController = require('../controllers/layout/headerController');

// ===== PUBLIC ROUTES =====
router.get('/', headerController.getHeader);

// ===== ADMIN ROUTES =====
router.put('/', headerController.updateHeader);
router.put('/logo', headerController.updateHeaderLogo);
router.put('/navigation', headerController.updateHeaderNavigation);
router.post('/navigation', headerController.addNavigationItem);
router.delete('/navigation/:href', headerController.removeNavigationItem);
router.put('/languages', headerController.updateHeaderLanguages);

module.exports = router; 
