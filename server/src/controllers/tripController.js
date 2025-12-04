const db = require('../../db');
const { GoogleGenAI } = require('@google/genai'); 

// Inicializar el cliente de Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// --- ESQUEMA DE SALIDA DE LA IA ---
const itinerarySchema = {
    type: "OBJECT",
    properties: {
        title: { type: "STRING", description: "Un título atractivo para el viaje." },
        description: { type: "STRING", description: "Resumen breve del viaje y el estilo." },
        dailyPlan: {
            type: "ARRAY",
            description: "Una lista de los planes detallados para cada día del viaje.",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "Número del día, empezando en 1." },
                    activity: { type: "STRING", description: "Descripción detallada de la actividad principal del día, incluyendo visitas o cenas." }
                },
                required: ["day", "activity"]
            }
        },
        highlights: { type: "ARRAY", items: { type: "STRING" }, description: "Tres o cuatro puntos clave y exclusivos del itinerario." },
        coordinates: { // <--- ESQUEMA CORREGIDO: COORDENADAS NUMÉRICAS
            type: "OBJECT",
            description: "Coordenadas geográficas del centro del destino principal.",
            properties: {
                lat: { type: "NUMBER", description: "Latitud del centro del destino (Ej: 37.3888 para Sevilla)" },
                lng: { type: "NUMBER", description: "Longitud del centro del destino (Ej: -5.995 para Sevilla)" }
            },
            required: ["lat", "lng"]
        }
    },
    required: ["title", "description", "dailyPlan", "highlights", "coordinates"] 
};


// --- FUNCIÓN HELPER: LLAMADA A LA IA REAL ---
const generateItineraryData = async (destination, days, budget, travelers) => {
    // Instrucción precisa para la IA sobre las coordenadas
    const userPrompt = `Crea un itinerario de viaje a ${destination}. Proporciona las coordenadas EXACTAS del centro de la ciudad para la visualización en mapas.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: itinerarySchema,
            },
        });
        
        const jsonText = response.text.trim();
        const tripData = JSON.parse(jsonText);

        // Seguridad: Asegurar que los valores son números (crucial para Google Maps)
        if (tripData.coordinates) {
            tripData.coordinates.lat = parseFloat(tripData.coordinates.lat);
            tripData.coordinates.lng = parseFloat(tripData.coordinates.lng);
        }

        return tripData;
        
    } catch (error) {
        console.error("Error al llamar a Gemini API:", error.message);
        // Coordenadas de respaldo para Sevilla real, para que al menos veas algo en España
        return {
            title: "Error de Conexión IA",
            description: "No se pudo contactar a la IA. Inténtalo de nuevo.",
            highlights: ["Fallo de conexión"],
            dailyPlan: [{ day: 1, activity: "Error en la conexión con el servidor de IA." }],
            coordinates: { lat: 37.38283, lng: -5.97317 } 
        };
    }
};

// --- CREAR VIAJE ---
const createTrip = async (req, res) => {
    const { destination, days, budget, travelers } = req.body;
    const userId = req.user.id; 

    try {
        // Llamar a la IA real
        const tripData = await generateItineraryData(destination, days, budget, travelers);
        console.log("✨ Contenido JSON generado por Gemini.");

        // Guardar en Base de Datos
        const newTrip = await db.query(
            'INSERT INTO trips (user_id, destination, trip_data, status, budget, days, travelers) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, destination, tripData, 'draft', budget, days, travelers]
        );

        res.status(201).json({ message: 'Viaje generado', trip: newTrip.rows[0] });

    } catch (error) {
        console.error("❌ Error en createTrip:", error);
        res.status(500).json({ error: 'Error interno al procesar la solicitud de la IA.' });
    }
};

// --- OBTENER TODOS LOS VIAJES (FILTRADO POR USUARIO) ---
const getMyTrips = async (req, res) => {
    const userId = req.user.id;
    try {
        const trips = await db.query('SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(trips.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener viajes' });
    }
};

// --- OBTENER UN VIAJE POR ID (SEGURIZADO) ---
const getTripById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
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