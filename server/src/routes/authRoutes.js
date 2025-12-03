const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/rateLimitMiddleware'); // <--- IMPORTAMOS EL POLICÍA

// Aplicamos el limitador SOLO a las rutas de entrada para prevenir ataques de fuerza bruta.
// Máximo 10 intentos en 15 minutos.

// POST /api/auth/register (Protegido por límite de tasa)
router.post('/register', loginLimiter, authController.register);

// POST /api/auth/login (Protegido por límite de tasa)
router.post('/login', loginLimiter, authController.login);

module.exports = router;