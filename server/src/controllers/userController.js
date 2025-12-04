const db = require('../../db');
const bcrypt = require('bcrypt'); // Necesario para encriptar la nueva password

// --- OBTENER PERFIL ---
const getProfile = async (req, res) => {
    // Usamos el ID del usuario autenticado (del token)
    const userId = req.user.id; 

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

// --- ACTUALIZAR PERFIL (Ahora soporta contraseña) ---
const updateProfile = async (req, res) => {
    const { full_name, email, password } = req.body;
    const userId = req.user.id; // Seguridad: Usamos el ID del token, no del body

    try {
        let query;
        let values;

        // Si el usuario envió una nueva contraseña, hay que encriptarla
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            
            query = 'UPDATE users SET full_name = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING id, full_name, email, role';
            values = [full_name, email, passwordHash, userId];
        } else {
            // Si no hay contraseña nueva, solo actualizamos datos normales
            query = 'UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, full_name, email, role';
            values = [full_name, email, userId];
        }

        const result = await db.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Perfil actualizado correctamente', user: result.rows[0] });

    } catch (error) {
        console.error("Error update:", error);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};

// --- LOGOUT ---
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, 
        sameSite: 'lax',
        path: '/'
    });
    res.json({ message: 'Sesión cerrada correctamente' });
};

module.exports = { getProfile, updateProfile, logout };