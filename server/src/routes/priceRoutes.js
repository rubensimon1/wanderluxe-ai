const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

// GET /api/price?days=X&budget=Y -> Obtiene el precio
router.get('/', priceController.getPrice);

module.exports = router;