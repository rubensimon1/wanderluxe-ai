const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // CHIVATO: Imprimir qué cookies llegan al servidor
    console.log("🛡️ Middleware revisando cookies:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
        console.log("⛔ Acceso denegado: No hay token en la petición");
        return res.status(401).json({ error: 'Acceso denegado. No hay sesión activa.' });
    }

    try {
        // Verificar si el token es real
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        
        // Guardamos los datos del usuario en la petición
        req.user = verified;
        
        console.log(`🔓 Acceso concedido a usuario ID: ${verified.id}`);
        
        // Dejar pasar al controlador
        next();
    } catch (error) {
        console.log("⛔ Token inválido o expirado");
        res.status(400).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = verifyToken;