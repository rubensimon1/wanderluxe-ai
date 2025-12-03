import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import Checkout from './pages/Checkout';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import Profile from './pages/Profile'; // <--- NUEVO: Importamos el perfil

// --- COMPONENTE PORTADA (HOME) --- 
const Home = () => {
  return (
    <div className="min-h-screen bg-luxe-black text-luxe-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Efectos de Fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-luxe-gold opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-luxe-gold opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 text-center px-4 max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-luxe-gold via-yellow-200 to-luxe-gold mb-6 drop-shadow-lg">
          WanderLuxe AI
        </h1>
        
        <p className="text-lg md:text-2xl font-light tracking-[0.3em] uppercase mb-12 text-gray-400">
          El arte de viajar, perfeccionado por la inteligencia artificial.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link 
            to="/login" 
            className="px-10 py-4 bg-luxe-gold text-luxe-black font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            ✨ Diseñar mi Viaje
          </Link>
          
          <Link 
            to="/register" 
            className="px-10 py-4 border border-luxe-gold text-luxe-gold font-bold text-lg rounded-full hover:bg-luxe-gold/10 transition-all duration-300"
          >
            Unirse al Club
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-gray-600 text-xs tracking-[0.2em]">
        EST. 2025 • EXCLUSIVE TRAVEL CONCIERGE
      </div>
    </div>
  );
};

// --- APP PRINCIPAL (ROUTER) ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Privadas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-trips" element={<MyTrips />} />
        
        {/* Ruta de Detalles */}
        <Route path="/trip/:id" element={<TripDetails />} />

        {/* Ruta de Perfil (NUEVA) */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;