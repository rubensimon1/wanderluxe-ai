const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /api/payments/pay
router.post('/pay', paymentController.processPayment);

module.exports = router;