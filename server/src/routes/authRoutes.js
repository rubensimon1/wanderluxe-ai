const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definimos el camino final: /register
// (La parte /api/auth se define en el index.js)
router.post('/register', authController.register);

// Definimos el login (aunque esté vacío por ahora)
router.post('/login', authController.login);

module.exports = router;