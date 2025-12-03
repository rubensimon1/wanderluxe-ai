const db = require('../../db');

const handleMessage = async (req, res) => {
    const { message } = req.body; 
    const userId = req.user.id; 
    const msg = message.toLowerCase();

    console.log(`💬 Usuario ${userId} dice: "${message}"`);

    try {
        // 1. Guardar mensaje usuario
        await db.query('INSERT INTO messages (user_id, sender, text) VALUES ($1, $2, $3)', [userId, 'user', message]);

        // Simulamos pensamiento...
        await new Promise(resolve => setTimeout(resolve, 800));

        let reply = "";

        // --- CASO 1: PREGUNTA POR LISTA DE VIAJES ---
        if (msg.includes('viajes') || msg.includes('tengo') || msg.includes('lista')) {
            const allTrips = await db.query('SELECT destination, status FROM trips WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            
            if (allTrips.rows.length > 0) {
                const lista = allTrips.rows.map(t => `${t.destination} (${t.status === 'paid' ? 'Confirmado' : 'Borrador'})`).join(', ');
                reply = `He encontrado estos viajes en tu cuenta: ${lista}. ¿Sobre cuál quieres hablar?`;
            } else {
                reply = "No tienes ningún viaje registrado. Ve al Dashboard para diseñar el primero.";
            }
        } 
        
        // --- CASO 2: CONTEXTO DEL ÚLTIMO VIAJE ---
        else {
            // Buscamos el último viaje (YA SEA PAGADO O BORRADOR)
            // Esto lo hace más flexible
            const tripQuery = `SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`;
            const tripResult = await db.query(tripQuery, [userId]);

            if (tripResult.rows.length === 0) {
                reply = "Aún no tienes viajes. Diseña uno nuevo y podré darte recomendaciones.";
            } else {
                const trip = tripResult.rows[0];
                const dest = trip.destination;
                
                // Debug para que veas en la terminal qué viaje encontró
                console.log(`🔎 Contexto encontrado: ${dest} (Estado: ${trip.status})`);

                if (msg.includes('clima') || msg.includes('tiempo')) {
                    reply = `Para tu viaje a ${dest}, se espera un clima excelente. Unos 22°C de media.`;
                } else if (msg.includes('comer') || msg.includes('restaurante') || msg.includes('cena')) {
                    reply = `En ${dest} te recomiendo reservar en el centro histórico. Hay opciones de lujo increíbles.`;
                } else if (msg.includes('ropa') || msg.includes('maleta')) {
                    reply = `Prepara ropa cómoda pero elegante para ${dest}.`;
                } else if (msg.includes('hola')) {
                    reply = `¡Hola! Veo que estás planeando ir a ${dest}. ¿Qué necesitas saber?`;
                } else {
                    // Respuesta genérica mejorada
                    reply = `Interesante pregunta sobre ${dest}. Como IA en entrenamiento, soy experta en 'Clima', 'Restaurantes' y 'Ropa'. ¡Pruébame con esos temas!`;
                }

                // Si el viaje es un borrador, añadimos un recordatorio
                if (trip.status === 'draft') {
                    reply += " (Nota: Recuerda completar el pago para confirmar tu reserva).";
                }
            }
        }

        // 2. Guardar respuesta IA
        await db.query('INSERT INTO messages (user_id, sender, text) VALUES ($1, $2, $3)', [userId, 'ai', reply]);

        res.json({ reply, sender: 'ai' });

    } catch (error) {
        console.error("Error chat:", error);
        res.status(500).json({ error: 'Error procesando mensaje' });
    }
};

const getHistory = async (req, res) => {
    const userId = req.user.id; 
    try {
        const result = await db.query('SELECT sender, text FROM messages WHERE user_id = $1 ORDER BY created_at ASC', [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error cargando chat' });
    }
};

module.exports = { handleMessage, getHistory };