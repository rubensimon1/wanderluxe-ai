import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import Checkout from './pages/Checkout';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import Profile from './pages/Profile';
import Services from './pages/Services';
import InfoPage from './pages/InfoPage';

// Components
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';

// Imágenes de ciudades (usando Unsplash)
const cities = [
  {
    name: 'París',
    country: 'Francia',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'La ciudad del amor y las luces'
  },
  {
    name: 'Tokyo',
    country: 'Japón',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    description: 'Donde la tradición encuentra el futuro'
  },
  {
    name: 'Santorini',
    country: 'Grecia',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    description: 'Atardeceres sobre el mar Egeo'
  },
  {
    name: 'Nueva York',
    country: 'Estados Unidos',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    description: 'La ciudad que nunca duerme'
  },
  {
    name: 'Dubai',
    country: 'Emiratos Árabes',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    description: 'Lujo en el desierto'
  },
  {
    name: 'Maldivas',
    country: 'Océano Índico',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    description: 'Paraíso tropical exclusivo'
  },
];

// Componente de tarjeta de ciudad con animación
const CityCard = ({ city, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="w-full md:w-1/2">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-xs uppercase tracking-[0.3em] text-luxe-gold font-bold">
              {city.country}
            </span>
            <h3 className="text-3xl md:text-4xl font-serif text-white mt-1">
              {city.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left">
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
          {city.description}
        </p>
        <Link
          to="/login"
          className="inline-block mt-6 px-8 py-3 border border-luxe-gold text-luxe-gold rounded-full hover:bg-luxe-gold hover:text-luxe-black transition-all duration-300 font-medium"
        >
          Explorar {city.name}
        </Link>
      </div>
    </motion.div>
  );
};

// Landing Page (Home público)
const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <div className="min-h-screen bg-luxe-cream dark:bg-luxe-black text-gray-900 dark:text-luxe-white font-sans transition-colors duration-500">

      {/* Navbar de Home */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-luxe-gold font-serif font-bold text-xl tracking-wider">
          WanderLuxe
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="text-white text-sm font-bold hover:text-luxe-gold transition-colors px-4 py-2"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="text-luxe-black bg-luxe-gold text-sm font-bold px-5 py-2 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      >
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900" />
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-luxe-gold opacity-20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-luxe-gold opacity-10 rounded-full blur-3xl pointer-events-none" />

        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="z-10 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-luxe-gold via-yellow-200 to-luxe-gold mb-6 drop-shadow-lg">
              WanderLuxe AI
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-2xl font-light tracking-[0.2em] uppercase mb-12 text-gray-300"
          >
            El arte de viajar, perfeccionado por la inteligencia artificial.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <Link
              to="/register"
              className="px-10 py-4 bg-luxe-gold text-luxe-black font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              ✨ Comenzar Ahora
            </Link>
            <a
              href="#destinos"
              className="px-10 py-4 border border-white/30 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Ver Destinos
            </a>
          </motion.div>
        </div>

        {/* Indicador de scroll */}
        <motion.div
          className="absolute bottom-10 text-gray-400 text-xs tracking-[0.2em]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          DESCUBRE MÁS ↓
        </motion.div>
      </motion.section>

      {/* Sección de Ciudades */}
      <section id="destinos" className="py-24 px-6 md:px-12 bg-white dark:bg-gray-950 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-luxe-gold text-sm uppercase tracking-[0.3em] font-bold">
              Destinos Exclusivos
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900 dark:text-white">
              Donde tus sueños cobran vida
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Descubre los destinos más exclusivos del mundo, diseñados para viajeros que buscan experiencias únicas.
            </p>
          </motion.div>

          <div className="space-y-24">
            {cities.map((city, index) => (
              <CityCard key={city.name} city={city} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Únete a miles de viajeros que ya diseñan sus experiencias con inteligencia artificial.
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-5 bg-luxe-gold text-luxe-black font-bold text-xl rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.5)]"
          >
            Crear Mi Cuenta Gratis
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

// Layout para páginas autenticadas
const AuthenticatedLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-luxe-black' : 'bg-luxe-cream'} transition-colors duration-300`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Layout para páginas públicas (login, register)
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

function AppContent() {
  const location = useLocation();

  // Páginas que NO necesitan navbar (públicas o con su propio layout)
  const publicPaths = ['/', '/login', '/register', '/help', '/terms', '/privacy', '/about'];
  const isPublicPage = publicPaths.includes(location.pathname);

  return (
    <Routes>
      {/* Página principal pública */}
      <Route path="/" element={<Home />} />

      {/* Auth pages (sin navbar) */}
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

      {/* Páginas autenticadas (con navbar) */}
      <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
      <Route path="/create-trip" element={<AuthenticatedLayout><CreateTrip /></AuthenticatedLayout>} />
      <Route path="/checkout" element={<AuthenticatedLayout><Checkout /></AuthenticatedLayout>} />
      <Route path="/my-trips" element={<AuthenticatedLayout><MyTrips /></AuthenticatedLayout>} />
      <Route path="/trip/:id" element={<AuthenticatedLayout><TripDetails /></AuthenticatedLayout>} />
      <Route path="/profile" element={<AuthenticatedLayout><Profile /></AuthenticatedLayout>} />
      <Route path="/services" element={<AuthenticatedLayout><Services /></AuthenticatedLayout>} />

      {/* Páginas informativas */}
      <Route path="/help" element={<AuthenticatedLayout><InfoPage /></AuthenticatedLayout>} />
      <Route path="/terms" element={<AuthenticatedLayout><InfoPage /></AuthenticatedLayout>} />
      <Route path="/privacy" element={<AuthenticatedLayout><InfoPage /></AuthenticatedLayout>} />
      <Route path="/about" element={<AuthenticatedLayout><InfoPage /></AuthenticatedLayout>} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;