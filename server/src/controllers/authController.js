const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- REGISTRO ---
const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    console.log(`📝 Intento de registro: ${email}`); 

    try {
        const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, role',
            [fullName, email, passwordHash]
        );

        const token = jwt.sign(
            { id: newUser.rows[0].id, role: newUser.rows[0].role }, 
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        // CONFIGURACIÓN DE COOKIE (Actualizada)
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // false para localhost
            sameSite: 'lax',
            path: '/', // <--- IMPORTANTE: Disponible en toda la web
            maxAge: 24 * 60 * 60 * 1000
        });

        console.log("✅ Usuario registrado con éxito");
        
        res.status(201).json({ 
            message: 'Usuario creado correctamente', 
            user: newUser.rows[0] 
        });

    } catch (error) {
        console.error("❌ Error CRÍTICO en el registro:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// --- LOGIN ---
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`🔑 Intento de login: ${email}`);

    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            console.log("⛔ Usuario no encontrado");
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            console.log("⛔ Contraseña incorrecta");
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        // CONFIGURACIÓN DE COOKIE (Actualizada)
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/', // <--- IMPORTANTE
            maxAge: 24 * 60 * 60 * 1000
        });

        console.log("✅ Login exitoso");

        const { password_hash, ...userData } = user;
        res.json({ 
            message: 'Login correcto', 
            user: userData
        });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { register, login };