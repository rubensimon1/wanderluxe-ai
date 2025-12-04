import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import Checkout from './pages/Checkout';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import Profile from './pages/Profile';
import Services from './pages/Services';
import InfoPage from './pages/InfoPage'; // Importamos la página informativa
import Footer from './components/Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooter = ['/login', '/register'].includes(location.pathname);
  
  // Determinar si estamos en la página de inicio
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* NAVBAR DE PORTADA: Solo visible en Home */}
      {isHome && (
        <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
            <div className="text-luxe-gold font-serif font-bold text-xl tracking-wider">WanderLuxe</div>
            <div className="flex gap-4">
                <Link to="/login" className="text-white text-sm font-bold hover:text-luxe-gold transition-colors px-4 py-2 border border-transparent hover:border-luxe-gold/50 rounded-full">
                    Iniciar Sesión
                </Link>
                <Link to="/register" className="text-luxe-black bg-white text-sm font-bold px-4 py-2 rounded-full hover:bg-luxe-gold transition-colors shadow-lg">
                    Registrarse
                </Link>
            </div>
        </nav>
      )}

      <div className="flex-grow">
        {children}
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-luxe-black text-luxe-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-luxe-gold opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-luxe-gold opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 text-center px-4 max-w-5xl mt-[-50px]">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-luxe-gold via-yellow-200 to-luxe-gold mb-6 drop-shadow-lg">
          WanderLuxe AI
        </h1>
        <p className="text-lg md:text-2xl font-light tracking-[0.3em] uppercase mb-12 text-gray-400">
          El arte de viajar, perfeccionado por la inteligencia artificial.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link to="/login" className="px-10 py-4 bg-luxe-gold text-luxe-black font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            ✨ Diseñar mi Viaje
          </Link>
          <Link to="/services" className="px-10 py-4 border border-luxe-gold text-luxe-gold font-bold text-lg rounded-full hover:bg-luxe-gold/10 transition-all duration-300">
            Explorar Servicios
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-gray-600 text-xs tracking-[0.2em] animate-bounce">
        DESCUBRE MÁS ↓
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          
          {/* NUEVAS RUTAS INFORMATIVAS */}
          <Route path="/help" element={<InfoPage />} />
          <Route path="/terms" element={<InfoPage />} />
          <Route path="/privacy" element={<InfoPage />} />
          <Route path="/about" element={<InfoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;