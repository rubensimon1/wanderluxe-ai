import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: '', full_name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 1. Cargar datos de la memoria del navegador
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
    } else {
      // Si no hay usuario guardado, mandar al login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    // Intentamos avisar al backend (opcional)
    try {
      await fetch('http://127.0.0.1:3000/api/users/logout', { method: 'POST' });
    } catch (e) {
      console.error("Error logout backend", e);
    }
    
    // Limpiamos la memoria del navegador
    localStorage.removeItem('user');
    alert("Has cerrado sesión correctamente.");
    navigate('/');
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user) // Enviamos el usuario con el ID incluido
      });
      
      const data = await response.json();

      if (response.ok) {
        // Actualizamos la memoria con los datos nuevos (nombre/email cambiados)
        localStorage.setItem('user', JSON.stringify(data.user)); 
        setUser(data.user);
        setIsEditing(false);
        alert("✨ Perfil actualizado correctamente");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-luxe-black text-luxe-white font-sans p-8 flex justify-center items-center relative overflow-hidden">
      {/* Fondo ambiental */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-purple-900/20 z-0"></div>

      <div className="w-full max-w-2xl z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-serif text-luxe-gold">Mi Perfil</h1>
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Volver al Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          
          {/* Avatar Generado (Iniciales) */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-luxe-gold to-yellow-200 flex items-center justify-center text-4xl font-bold text-luxe-black shadow-lg shadow-luxe-gold/20 border-4 border-black">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest text-center">
              Miembro WanderLuxe<br/>ID: {user.id}
            </div>
          </div>

          {/* Formulario de Datos */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Campo Nombre */}
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Nombre Completo</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={user.full_name}
                  onChange={(e) => setUser({...user, full_name: e.target.value})}
                  className="w-full bg-black/50 border border-luxe-gold rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-luxe-gold transition-all"
                />
              ) : (
                <div className="text-xl font-medium text-white border-b border-white/10 pb-2">
                  {user.full_name}
                </div>
              )}
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Correo Electrónico</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="w-full bg-black/50 border border-luxe-gold rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-luxe-gold transition-all"
                />
              ) : (
                <div className="text-xl font-medium text-gray-300 border-b border-white/10 pb-2">
                  {user.email}
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="pt-6 flex flex-wrap gap-4">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave} 
                    className="flex-1 px-6 py-2 bg-luxe-gold text-luxe-black font-bold rounded-lg hover:bg-white transition-colors shadow-lg"
                  >
                    Guardar Cambios
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="flex-1 px-6 py-2 border border-luxe-gold text-luxe-gold rounded-lg hover:bg-luxe-gold/10 transition-colors font-medium"
                  >
                    Editar Perfil
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="px-6 py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-colors text-sm"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;