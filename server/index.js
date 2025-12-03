const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./db');
require('dotenv').config();

// 1. IMPORTAR RUTAS
const authRoutes = require('./src/routes/authRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. CONFIGURACIÓN CORS (MODIFICADA PARA DESPLIEGUE)
// Permitimos cualquier origen (origin: true) para que cuando Vercel genere tu URL,
// el backend de Render no rechace la conexión.
app.use(cors({
    origin: true, 
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// 3. ACTIVAR LAS RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// Ruta base de prueba (Útil para saber si Render ha arrancado bien)
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            message: '🥂 Backend WanderLuxe Operativo en la Nube', 
            time: result.rows[0].now 
        });
    } catch (err) {
        console.error("Error en BD:", err);
        res.status(500).json({ error: 'Error conectando a la base de datos' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});