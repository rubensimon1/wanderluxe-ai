const db = require('../../db');
const { GoogleGenAI } = require('@google/genai'); 

// Inicializar el cliente de Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// --- ESQUEMA 1: INTENCIÓN DE CREACIÓN DE VIAJE ---
// Este esquema se usa para que la IA decida si el mensaje del usuario es un comando para crear un viaje.
const tripIntentSchema = {
    type: "OBJECT",
    properties: {
        is_creation_command: { 
            type: "BOOLEAN", 
            description: "Verdadero si el usuario solicita explícitamente la creación de un nuevo itinerario (ej: 'créame', 'diseña', 'quiero generar')." 
        },
        destination: { type: "STRING", description: "El destino solicitado (ej: 'París', 'Bali'). Obligatorio si is_creation_command es true." },
        days: { type: "INTEGER", description: "Número de días del viaje. Obligatorio si is_creation_command es true." },
        budget: { type: "STRING", description: "Estilo o presupuesto (ej: 'lujo', 'aventura', 'económico'). Obligatorio si is_creation_command es true." },
        travelers: { type: "INTEGER", description: "Número de personas que viajan. Obligatorio si is_creation_command es true." }
    },
    required: ["is_creation_command"] // Solo necesitamos saber la intención
};

// --- ESQUEMA 2: GENERACIÓN DEL ITINERARIO DETALLADO ---
// Este es el mismo esquema que usamos en tripController.js para generar el plan.
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
        highlights: { type: "ARRAY", items: { type: "STRING" }, description: "Tres o cuatro puntos clave y exclusivos del itinerario." }
    },
    required: ["title", "description", "dailyPlan", "highlights"]
};

// --- FUNCIÓN HELPER: Genera el Itinerario Detallado (Duplicado de tripController) ---
const generateItineraryData = async (destination, days, budget, travelers) => {
    const userPrompt = `Crea un itinerario de viaje de ${days} días para ${travelers} personas a ${destination}, enfocado en un estilo ${budget}. El itinerario debe ser detallado y exclusivo.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: itinerarySchema,
        },
    });
    
    // Parseamos y devolvemos el JSON generado
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};


// --- FUNCIÓN PRINCIPAL: MANEJAR MENSAJE ---
const handleMessage = async (req, res) => {
    const { message } = req.body; 
    const userId = req.user.id; 
    let reply = "";

    try {
        // 1. Guardar el mensaje del USUARIO
        await db.query(
            'INSERT INTO messages (user_id, sender, text) VALUES ($1, $2, $3)',
            [userId, 'user', message]
        );

        // 2. Determinar la intención del usuario (Crear viaje o chatear)
        const intentPrompt = `Analiza si el siguiente mensaje es una solicitud de creación de un nuevo itinerario de viaje. Extrae el destino, días, presupuesto/estilo y número de viajeros. Mensaje: "${message}"`;

        const intentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: intentPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tripIntentSchema,
            },
        });
        
        const intentJson = JSON.parse(intentResponse.text.trim());

        // --- LÓGICA DE CREACIÓN DE VIAJE ---
        if (intentJson.is_creation_command && intentJson.destination && intentJson.days && intentJson.budget) {
            
            const { destination, days, budget, travelers } = intentJson;
            const finalTravelers = travelers || 1; // Default a 1 si la IA no lo extrajo

            reply = `¡Entendido! Generando un nuevo itinerario para ${destination} de ${days} días, estilo ${budget}, para ${finalTravelers} persona(s)... Esto puede tomar unos segundos.`;

            // Guarda la respuesta inicial de la IA para que el usuario vea que está trabajando
            await db.query(
                'INSERT INTO messages (user_id, sender, text) VALUES ($1, $2, $3)',
                [userId, 'ai', reply]
            );
            res.status(200).json({ reply, sender: 'ai' }); // Responde al usuario para actualizar el chat

            // ** SECCIÓN CRÍTICA: Lógica de creación de viaje en segundo plano **
            
            // 1. Generar datos del viaje con la IA (tarda)
            const tripData = await generateItineraryData(destination, days, budget, finalTravelers);

            // 2. Guardar el viaje en Base de Datos
            const newTrip = await db.query(
                'INSERT INTO trips (user_id, destination, trip_data, status, budget, days, travelers) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [userId, destination, tripData, 'draft', budget, days, finalTravelers]
            );

            // 3. Envía una notificación final (Esto requiere una segunda actualización en el chat del frontend
            //    que está fuera del alcance de una sola respuesta, pero lo registramos en DB).
            const successReply = `✅ ¡Listo! Acabo de crear tu viaje a ${destination}. Puedes verlo y editarlo en la sección "Mis Viajes" (ID: ${newTrip.rows[0].id}).`;
            await db.query(
                'INSERT INTO messages (user_id, sender, text) VALUES ($1, $2, $3)',
                [userId, 'ai', successReply]
            );

            return; // Termina la ejecución aquí

        } 
        
        // --- LÓGICA DE CHAT CONTEXTUAL (Si no es un comando de creación) ---
        else {
            
            // Buscar contexto (Último viaje)
            const tripQuery = `
                SELECT destination, status FROM trips 
                WHERE user_id = $1 
                ORDER BY created_at DESC LIMIT 1
            `;
            const tripResult = await db.query(tripQuery, [userId]);
            
            if (tripResult.rows.length > 0) {
                const dest = tripResult.rows[0].destination;
                
                const systemPrompt = `Eres WanderLuxe, un concierge de viajes de lujo experto. Estás conversando con el usuario sobre su próximo viaje a ${dest}. Responde de manera profesional y concisa, manteniendo el contexto del destino.`;

                const chatResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: message,
                    config: {
                        systemInstruction: { parts: [{ text: systemPrompt }] }
                    },
                });

                reply = chatResponse.text.trim();
                
            } else {
                reply = "No has diseñado ningún viaje aún. ¿Te gustaría que te ayude a crear uno? Solo dímelo (ej: 'créame un viaje a Madrid').";
            }
        }
        
        // 3. Guardar la respuesta final de la IA y enviar al frontend
        await db.query(
            'INSERT INTO messages (user_id, sender, text) VALUES ($1, $2, $3)',
            [userId, 'ai', reply]
        );
        res.json({ reply, sender: 'ai' });

    } catch (error) {
        console.error("❌ Error FATAL en chat handleMessage:", error);
        reply = "Lo siento, hubo un error grave al procesar tu solicitud o al contactar a la IA. Inténtalo de nuevo.";
        
        await db.query(
            'INSERT INTO messages (user_id, sender, text) VALUES ($1, $2, $3)',
            [userId, 'ai', reply]
        );
        res.status(500).json({ reply, sender: 'ai' });
    }
};

// --- OBTENER HISTORIAL ---
const getHistory = async (req, res) => {
    const userId = req.user.id; 
    try {
        const result = await db.query(
            'SELECT sender, text FROM messages WHERE user_id = $1 ORDER BY created_at ASC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error cargando chat' });
    }
};

module.exports = { handleMessage, getHistory };