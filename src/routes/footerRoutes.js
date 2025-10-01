const express = require('express');
const router = express.Router();
const footerController = require('../controllers/layout/footerController');

// Footer public routes
router.get('/', footerController.getFooter);

// Footer admin routes
router.put('/', footerController.updateFooter);
router.delete('/', footerController.deleteFooter);

module.exports = router; 