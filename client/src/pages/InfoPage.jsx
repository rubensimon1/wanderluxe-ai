import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const InfoPage = () => {
  const location = useLocation();
  const path = location.pathname;

  // Contenido dinámico según la URL
  let content = {
    title: "Información",
    text: "Página informativa."
  };

  if (path === '/help') {
    content = {
      title: "Centro de Ayuda",
      text: "Nuestro equipo de Concierge está disponible 24/7. Para emergencias durante tu viaje, usa el botón de chat en tu Dashboard. Para consultas de facturación, escribe a support@wanderluxe.ai."
    };
  } else if (path === '/terms') {
    content = {
      title: "Términos y Condiciones",
      text: "Al usar WanderLuxe AI, aceptas que los itinerarios son generados por inteligencia artificial. WanderLuxe no se hace responsable de cambios climáticos imprevistos o cierres de locales sugeridos. Las reservas de pago son finales."
    };
  } else if (path === '/privacy') {
    content = {
      title: "Política de Privacidad",
      text: "Tus datos de viaje y preferencias son sagrados. Encriptamos toda la información personal y financiera. No compartimos tus itinerarios con terceros sin tu consentimiento explícito."
    };
  } else if (path === '/about') {
    content = {
      title: "Sobre Nosotros",
      text: "Nacidos en 2025, WanderLuxe fusiona la tecnología más avanzada con la pasión por descubrir el mundo. Somos un equipo de viajeros e ingenieros dedicados a crear experiencias inolvidables."
    };
  }

  return (
    <div className="min-h-screen bg-luxe-black text-luxe-white font-sans p-12 flex justify-center">
      <div className="max-w-3xl w-full mt-10">
        <Link to="/" className="text-luxe-gold hover:underline text-sm mb-8 block">← Volver al Inicio</Link>
        
        <h1 className="text-5xl font-serif text-luxe-gold mb-8">{content.title}</h1>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl leading-relaxed text-lg text-gray-300">
          <p>{content.text}</p>
          <br/>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;