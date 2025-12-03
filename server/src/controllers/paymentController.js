const db = require('../../db');

const processPayment = async (req, res) => {
    const { tripId, cardHolder, cardNumber } = req.body;

    console.log(`💸 Procesando pago para el viaje ID: ${tripId}`);
    console.log(`💳 Titular: ${cardHolder} | Tarjeta: **** **** **** ${cardNumber.slice(-4)}`);

    try {
        // 1. Simular validación bancaria (Esperar 2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Simular validación de tarjeta (Simple: si termina en 0000, falla)
        if (cardNumber.endsWith('0000')) {
            return res.status(402).json({ error: 'Fondos insuficientes o tarjeta rechazada.' });
        }

        // 3. Actualizar el estado del viaje a "paid" en la Base de Datos
        const updateQuery = `
            UPDATE trips 
            SET status = 'paid' 
            WHERE id = $1 
            RETURNING *
        `;
        const result = await db.query(updateQuery, [tripId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Viaje no encontrado' });
        }

        console.log("✅ Pago exitoso. Viaje confirmado.");
        
        res.json({ 
            success: true, 
            message: 'Pago completado', 
            transactionId: 'TXN-' + Math.floor(Math.random() * 1000000),
            trip: result.rows[0]
        });

    } catch (error) {
        console.error("Error en pago:", error);
        res.status(500).json({ error: 'Error en la pasarela de pago' });
    }
};

module.exports = { processPayment };