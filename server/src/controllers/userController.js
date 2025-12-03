const db = require('../../db');

// --- OBTENER PERFIL ---
const getProfile = async (req, res) => {
    // NOTA SENIOR: Aquí deberíamos leer el ID desde el Token (Middleware).
    // Por simplicidad en este paso, lo recibimos como query param o header, 
    // pero simularemos que leemos el ID 1 o el que venga del frontend.
    const { userId } = req.query; 

    try {
        const result = await db.query('SELECT id, full_name, email, role, created_at FROM users WHERE id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar perfil' });
    }
};

// --- ACTUALIZAR PERFIL ---
const updateProfile = async (req, res) => {
    const { id, full_name, email } = req.body;

    try {
        const result = await db.query(
            'UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, full_name, email',
            [full_name, email, id]
        );
        res.json({ message: 'Perfil actualizado', user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

// --- LOGOUT (Destruir Cookie) ---
const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
};

module.exports = { getProfile, updateProfile, logout };