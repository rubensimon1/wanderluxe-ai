import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ChatWidget from '../components/ChatWidget';

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. LEEMOS EL USUARIO DE LA MEMORIA
  // Si no hay usuario (porque entraste directo), usamos un objeto vacío para que no falle
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-luxe-black text-luxe-white font-sans p-8">
      
      {/* --- BARRA SUPERIOR (AQUÍ ESTÁ EL CAMBIO) --- */}
      <nav className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-serif text-luxe-gold">WanderLuxe AI</h1>
        
        {/* Enlace al Perfil (Reemplaza al botón de cerrar sesión simple) */}
        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="text-right hidden md:block">
            <span className="block text-sm text-white font-bold">
              {user.full_name || 'Miembro'}
            </span>
            <span className="block text-xs text-luxe-gold uppercase tracking-wider">
              Ver Perfil
            </span>
          </div>
          {/* Círculo con inicial */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-luxe-gold to-yellow-200 flex items-center justify-center text-luxe-black font-bold border-2 border-transparent group-hover:border-white transition-all">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
        </Link>
      </nav>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="max-w-4xl mx-auto relative">
        <header className="mb-12">
          <h2 className="text-5xl font-serif mb-4">Bienvenido al Club.</h2>
          <p className="text-xl text-gray-400 font-light">
            ¿A dónde te llevarán tus sueños hoy? Nuestra IA está lista.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Tarjeta 1: Crear Nuevo Viaje */}
          <Link to="/create-trip" className="block group">
            <div className="bg-white/5 border border-luxe-gold/30 p-8 rounded-2xl hover:bg-white/10 transition-all cursor-pointer h-full">
              <div className="h-12 w-12 bg-luxe-gold rounded-full flex items-center justify-center mb-4 text-luxe-black font-bold text-2xl group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-2xl font-serif mb-2 text-white group-hover:text-luxe-gold transition-colors">
                Diseñar Nueva Experiencia
              </h3>
              <p className="text-sm text-gray-400">
                Deja que la IA cree un itinerario de lujo basado en tus gustos.
              </p>
            </div>
          </Link>

          {/* Tarjeta 2: Historial */}
          <Link to="/my-trips" className="block group">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all cursor-pointer h-full group-hover:border-white/30">
              <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-white text-xl group-hover:bg-gray-600 transition-colors">
                📂
              </div>
              <h3 className="text-2xl font-serif mb-2 text-white group-hover:text-luxe-gold transition-colors">
                Mis Viajes Guardados
              </h3>
              <p className="text-sm text-gray-400">
                Consulta tus itinerarios anteriores y reservas.
              </p>
            </div>
          </Link>

        </div>
      </div>

      {/* Chatbot Flotante */}
      <ChatWidget />

    </div>
  );
};

export default Dashboard;