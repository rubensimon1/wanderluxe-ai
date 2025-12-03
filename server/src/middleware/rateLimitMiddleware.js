const rateLimit = require('express-rate-limit');

// Definición del límite:
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos (tiempo que dura el castigo)
    max: 10, // Máximo 10 peticiones (Login/Registro) por IP en 15 minutos
    message: {
        error: "Has excedido el límite de intentos de login. Inténtalo de nuevo en 15 minutos."
    },
    standardHeaders: true, // Devuelve información del límite en las cabeceras
    legacyHeaders: false, // Desactiva las cabeceras X-RateLimit
});

// Exportamos la función para que pueda ser usada en las rutas.
module.exports = loginLimiter;