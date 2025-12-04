// FUNCIÓN QUE CALCULA EL PRECIO FINAL BASADO EN EL VIAJE
const calculatePrice = (days, budget, travelers) => {
    const BASE_COST = 50; // Costo fijo por el servicio y documentación
    const COST_PER_DAY = 150; 
    const COST_PER_TRAVELER = 75;

    // Multiplicador basado en el estilo
    let styleMultiplier = 1.0;
    if (budget === 'Lujo') {
        styleMultiplier = 1.5; // +50% por lujo
    } else if (budget === 'Aventura') {
        styleMultiplier = 1.1; // +10% por planificación compleja
    }

    // Costo base + costo por día + costo por persona
    let totalPrice = BASE_COST + (days * COST_PER_DAY) + (travelers * COST_PER_TRAVELER);

    // Aplicar multiplicador y redondear al euro más cercano
    totalPrice = Math.round(totalPrice * styleMultiplier);

    // Aseguramos un mínimo sensato
    if (totalPrice < 150) {
        return 150;
    }
    
    return totalPrice;
};

// Ruta para que el Frontend pida el precio antes de ir al Checkout
const getPrice = (req, res) => {
    const { days, budget, travelers } = req.query; // Los datos vienen de la URL

    if (!days || !budget || !travelers) {
        return res.status(400).json({ error: 'Faltan parámetros para calcular el precio.' });
    }

    try {
        const price = calculatePrice(
            parseInt(days), 
            budget, 
            parseInt(travelers)
        );
        res.json({ price: price });
    } catch (error) {
        res.status(500).json({ error: 'Error interno en el cálculo.' });
    }
};

module.exports = { getPrice, calculatePrice };