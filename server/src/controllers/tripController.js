const db = require('../../db');

// --- SIMULADOR DE IA ---
const generateItinerary = (destination, days, style) => {
    return {
        title: `Experiencia Exclusiva en ${destination}`,
        description: `Un viaje de ${days} días diseñado para un estilo ${style}.`,
        highlights: [
            "Cena con vistas panorámicas",
            "Tour privado por el centro histórico",
            "Experiencia gastronómica local"
        ],
        dailyPlan: Array.from({ length: days }, (_, i) => ({
            day: i + 1,
            activity: `Día ${i + 1}: Exploración de ${destination} con enfoque ${style}.`
        }))
    };
};

// --- CREAR VIAJE ---
const createTrip = async (req, res) => {
    const { destination, days, budget, travelers } = req.body;
    
    // --- SEGURIDAD: LEER ID DEL TOKEN ---
    // El middleware 'verifyToken' ya decodificó el token y puso los datos en req.user
    // Ya no usamos ID fijo, usamos el real del usuario logueado.
    const userId = req.user.id; 

    console.log(`🤖 Usuario ID ${userId} generando viaje a: ${destination}`);

    try {
        // 1. Simular espera de la IA
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 2. Generar datos
        const tripData = generateItinerary(destination, days, budget);

        // 3. Guardar en Base de Datos
        const newTrip = await db.query(
            'INSERT INTO trips (user_id, destination, trip_data, status, budget, days, travelers) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, destination, tripData, 'draft', budget, days, travelers]
        );

        console.log("✨ Viaje guardado correctamente");
        res.status(201).json({ message: 'Viaje generado', trip: newTrip.rows[0] });

    } catch (error) {
        console.error("❌ Error generando viaje:", error);
        res.status(500).json({ error: 'Error en base de datos: ' + error.message });
    }
};

// --- OBTENER TODOS LOS VIAJES (FILTRADO POR USUARIO) ---
const getMyTrips = async (req, res) => {
    // Leemos el ID del usuario autenticado
    const userId = req.user.id;

    try {
        // SOLO devolvemos los viajes que pertenezcan a este usuario
        const trips = await db.query('SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(trips.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener viajes' });
    }
};

// --- OBTENER UN VIAJE POR ID (SEGURIZADO) ---
const getTripById = async (req, res) => {
    const { id } = req.params; 
    const userId = req.user.id; // Mi ID real
    
    try {
        // SEGURIDAD: Buscamos el viaje Y verificamos que sea del usuario (AND user_id = $2)
        // Si el viaje existe pero es de otro usuario, la base de datos no lo devolverá.
        const tripResult = await db.query('SELECT * FROM trips WHERE id = $1 AND user_id = $2', [id, userId]);

        if (tripResult.rows.length === 0) {
            return res.status(404).json({ error: 'Viaje no encontrado o no tienes permiso.' });
        }

        res.json(tripResult.rows[0]);
    } catch (error) {
        console.error("Error obteniendo viaje:", error);
        res.status(500).json({ error: 'Error al cargar el itinerario' });
    }
};

module.exports = { createTrip, getMyTrips, getTripById };