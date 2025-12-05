import React from 'react';
import { Link } from 'react-router-dom';
import ChatWidget from '../components/ChatWidget';

const Dashboard = () => {
  // Leer usuario de localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-luxe-cream dark:bg-luxe-black text-gray-900 dark:text-luxe-white font-sans p-8 transition-colors duration-300">

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h2 className="text-5xl font-serif mb-4 text-gray-900 dark:text-white">
            Bienvenido, <span className="text-luxe-gold">{user.full_name?.split(' ')[0] || 'Viajero'}</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
            ¿A dónde te llevarán tus sueños hoy? Nuestra IA está lista.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Tarjeta 1: Crear Nuevo Viaje */}
          <Link to="/create-trip" className="block group">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-luxe-gold/30 p-8 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer h-full shadow-lg dark:shadow-none">
              <div className="h-12 w-12 bg-luxe-gold rounded-full flex items-center justify-center mb-4 text-luxe-black font-bold text-2xl group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-2xl font-serif mb-2 text-gray-900 dark:text-white group-hover:text-luxe-gold transition-colors">
                Diseñar Nueva Experiencia
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Deja que la IA cree un itinerario de lujo basado en tus gustos.
              </p>
            </div>
          </Link>

          {/* Tarjeta 2: Historial */}
          <Link to="/my-trips" className="block group">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer h-full shadow-lg dark:shadow-none group-hover:border-gray-300 dark:group-hover:border-white/30">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-700 dark:text-white text-xl group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                📂
              </div>
              <h3 className="text-2xl font-serif mb-2 text-gray-900 dark:text-white group-hover:text-luxe-gold transition-colors">
                Mis Viajes Guardados
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consulta tus itinerarios anteriores y reservas.
              </p>
            </div>
          </Link>

          {/* Tarjeta 3: Servicios */}
          <Link to="/services" className="block group">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer h-full shadow-lg dark:shadow-none group-hover:border-gray-300 dark:group-hover:border-white/30">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-700 dark:text-white text-xl group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                🏨
              </div>
              <h3 className="text-2xl font-serif mb-2 text-gray-900 dark:text-white group-hover:text-luxe-gold transition-colors">
                Hoteles & Servicios
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explora hoteles de lujo, coches y experiencias exclusivas.
              </p>
            </div>
          </Link>

          {/* Tarjeta 4: Perfil */}
          <Link to="/profile" className="block group">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer h-full shadow-lg dark:shadow-none group-hover:border-gray-300 dark:group-hover:border-white/30">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-700 dark:text-white text-xl group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                👤
              </div>
              <h3 className="text-2xl font-serif mb-2 text-gray-900 dark:text-white group-hover:text-luxe-gold transition-colors">
                Mi Perfil
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Actualiza tus datos, preferencias y foto de perfil.
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