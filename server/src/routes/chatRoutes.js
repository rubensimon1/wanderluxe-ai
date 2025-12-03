const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middleware/authMiddleware'); // <--- IMPORTAMOS SEGURIDAD

// POST /api/chat/send -> Enviar mensaje (Protegido)
router.post('/send', verifyToken, chatController.handleMessage);

// GET /api/chat/history -> Cargar historial (Protegido)
router.get('/history', verifyToken, chatController.getHistory);

module.exports = router;