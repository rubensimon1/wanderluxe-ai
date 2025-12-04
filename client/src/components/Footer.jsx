import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-white/10 font-sans">
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Columna 1: Marca */}
        <div>
          <h3 className="text-2xl font-serif text-luxe-gold mb-4">WanderLuxe AI</h3>
          <p className="text-sm leading-relaxed">
            Redefiniendo el turismo de lujo con inteligencia artificial. Tu viaje perfecto, diseñado en segundos.
          </p>
        </div>

        {/* Columna 2: Descubre */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Descubre</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/create-trip" className="hover:text-luxe-gold transition-colors">Diseñar Viaje</Link></li>
            <li><Link to="/services" className="hover:text-luxe-gold transition-colors">Hoteles & Coches</Link></li>
            <li><a href="#" className="hover:text-luxe-gold transition-colors">Destinos Top 2025</a></li>
          </ul>
        </div>

        {/* Columna 3: Soporte */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-luxe-gold transition-colors">Centro de Ayuda</a></li>
            <li><a href="#" className="hover:text-luxe-gold transition-colors">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-luxe-gold transition-colors">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-luxe-gold transition-colors">Contacto</a></li>
          </ul>
        </div>

        {/* Columna 4: Idioma y Redes */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Configuración</h4>
          <select className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-luxe-gold w-full mb-4">
            <option>🇪🇸 Español</option>
            <option>🇺🇸 English</option>
            <option>🇫🇷 Français</option>
          </select>
          <div className="text-xs">
            © 2025 WanderLuxe Inc.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;