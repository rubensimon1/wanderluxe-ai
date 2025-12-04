const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); // <--- IMPORTAR SEGURIDAD

// Rutas protegidas: Solo funcionan si el usuario tiene una sesión activa (Token válido)
// El middleware 'verifyToken' decodifica quién es el usuario antes de dejarle ver o editar su perfil.

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);

// El logout lo dejamos sin protección estricta para asegurar que cualquiera pueda 
// limpiar sus cookies (incluso si el token ya expiró).
router.post('/logout', userController.logout);

module.exports = router;