const db = require('../../db');
const { GoogleGenAI } = require('@google/genai'); // Importar SDK de Gemini

// Inicializar el cliente de Gemini usando la clave del .env
// Esto usa la variable GEMINI_API_KEY que configuraste.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// --- FUNCIÓN CENTRAL: LLAMADA A LA IA REAL ---
const generateItineraryReal = async (destination, days, budget, travelers) => {
    // Definimos el prompt para la IA
    const userPrompt = `Crea un itinerario de viaje de ${days} días para ${travelers} personas a ${destination}, enfocado en un estilo ${budget}. El itinerario debe ser detallado, exclusivo, y fácil de seguir.`;

    // Definimos el esquema de JSON que queremos que la IA devuelva (estructura)
    const schema = {
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
            highlights: { type: "ARRAY", items: { type: "STRING" }, description: "Tres o cuatro puntos clave y exclusivos del itinerario." }
        },
        required: ["title", "description", "dailyPlan", "highlights"]
    };

    try {
        // Llamada a la API de Gemini usando el modelo flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        // La respuesta de la IA viene como un string JSON, lo parseamos
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error al llamar a Gemini API:", error.message);
        // Si la IA falla (por clave, límite, etc.), devolvemos un plan de respaldo para que la app no se rompa
        return {
            title: "Error de Conexión IA",
            description: "No se pudo contactar a la IA. Inténtalo de nuevo.",
            highlights: ["Fallo de conexión", "Inténtalo más tarde"],
            dailyPlan: [{ day: 1, activity: "Error en la conexión con el servidor de IA." }]
        };
    }
};

// --- CREAR VIAJE ---
const createTrip = async (req, res) => {
    const { destination, days, budget, travelers } = req.body;
    const userId = req.user.id; // ID del usuario logueado

    console.log(`🤖 Usuario ID ${userId}: Iniciando generación REAL del viaje a ${destination}`);

    try {
        // 1. Llamar a la IA real (este paso ahora toma tiempo)
        const tripData = await generateItineraryReal(destination, days, budget, travelers);
        console.log("✨ Contenido JSON generado por Gemini.");

        // 2. Guardar en Base de Datos
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

// --- OBTENER VIAJES Y DETALLES (Mantenemos la lógica existente) ---

const getMyTrips = async (req, res) => {
    const userId = req.user.id;
    try {
        const trips = await db.query('SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(trips.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener viajes' });
    }
};

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