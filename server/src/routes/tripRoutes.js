const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const verifyToken = require('../middleware/authMiddleware'); // <--- IMPORTAMOS AL PORTERO

// AÑADIMOS 'verifyToken' COMO SEGUNDO ARGUMENTO EN LAS RUTAS
// El servidor ejecutará verifyToken PRIMERO. Si pasa, ejecuta el controlador.

// POST /api/trips/generate -> Crear nuevo viaje (Solo usuarios logueados)
router.post('/generate', verifyToken, tripController.createTrip);

// GET /api/trips/my-trips -> Ver historial (Solo mis viajes)
router.get('/my-trips', verifyToken, tripController.getMyTrips);

// GET /api/trips/:id -> Ver detalles (Solo si estoy logueado y es mío)
router.get('/:id', verifyToken, tripController.getTripById);

module.exports = router;