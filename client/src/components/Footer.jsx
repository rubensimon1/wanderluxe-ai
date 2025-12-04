import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [lang, setLang] = useState('es');

  const handleLangChange = (e) => {
    setLang(e.target.value);
    // Aquí iría la lógica real de traducción (i18n)
    alert(`Idioma cambiado a: ${e.target.options[e.target.selectedIndex].text} (Simulación)`);
  };

  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-white/10 font-sans mt-auto">
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
            <li>
              <Link to="/create-trip" className="hover:text-luxe-gold transition-colors">Diseñar Viaje</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-luxe-gold transition-colors">Hoteles & Coches</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-luxe-gold transition-colors">Sobre Nosotros</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Soporte (Enlaces Reales) */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/help" className="hover:text-luxe-gold transition-colors">Centro de Ayuda</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-luxe-gold transition-colors">Términos y Condiciones</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-luxe-gold transition-colors">Política de Privacidad</Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Idioma y Redes */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Idioma & Moneda</h4>
          <select 
            value={lang}
            onChange={handleLangChange}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-luxe-gold w-full mb-4 cursor-pointer"
          >
            <option value="es">🇪🇸 Español (EUR)</option>
            <option value="en">🇺🇸 English (USD)</option>
            <option value="fr">🇫🇷 Français (EUR)</option>
          </select>
          <div className="text-xs mt-4">
            © 2025 WanderLuxe Inc. Todos los derechos reservados.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;