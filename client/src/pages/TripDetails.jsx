import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const TripDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include' 
        });

        if (response.status === 401) {
          alert("Sesión expirada. Por favor, identifícate.");
          navigate('/login');
          return;
        }

        const data = await response.json();
        
        if (response.ok) {
          setTrip(data);
        } else {
          alert("Error: " + (data.error || "No se pudo cargar el viaje. Acceso denegado."));
        }
      } catch (error) {
        console.error("Error conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-luxe-black flex items-center justify-center text-luxe-gold">Cargando itinerario...</div>;
  
  if (!trip) return (
    <div className="min-h-screen bg-luxe-black flex flex-col items-center justify-center text-white gap-4">
      <p>Viaje no encontrado o no tienes permiso para verlo.</p>
      <Link to="/my-trips" className="text-luxe-gold underline">Volver a mis viajes</Link>
    </div>
  );

  const itinerary = trip.trip_data;
  // Usamos las coordenadas generadas por la IA, o un valor de respaldo si fallan
  const mapCenter = itinerary.coordinates || { lat: 37.7749, lng: -122.4194 }; 

  return (
    <div className="min-h-screen bg-luxe-black text-luxe-white font-sans p-8">
      
      {/* Cabecera / Navegación */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link to="/my-trips" className="text-gray-400 hover:text-white transition-colors text-sm mb-4 block">
          ← Volver a Mis Viajes
        </Link>
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-luxe-gold mb-2">{trip.destination}</h1>
            <p className="text-xl text-gray-300 font-light">{itinerary.title}</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm text-gray-500 uppercase tracking-widest">Estado</div>
            {trip.status === 'paid' ? (
              <span className="text-green-400 font-bold">CONFIRMADO</span>
            ) : (
              <span className="text-yellow-400 font-bold">BORRADOR</span>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del Itinerario */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Mapa y Servicios */}
        <div className="md:col-span-1 space-y-6">
          
          {/* BLOQUE MAPA Y UBICACIÓN */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 overflow-hidden shadow-lg">
            <h3 className="text-luxe-gold font-serif text-lg mb-2">Ubicación del Destino</h3>
            <p className="text-xs text-gray-500 mb-3">Lat: {mapCenter.lat}, Lng: {mapCenter.lng}</p>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${mapCenter.lat},${mapCenter.lng}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative overflow-hidden rounded-xl group"
            >
                {/* Usamos un placeholder de imagen con el nombre del destino y un efecto de hover */}
                <img 
                    src={`https://placehold.co/600x300/1e1e1e/d4af37?text=MAPA+DE+${trip.destination.toUpperCase()}`}
                    alt={`Mapa de ${trip.destination}`} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-luxe-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                    HACER ZOOM (Abrir en Maps)
                </div>
            </a>
          </div>

          {/* Bloque de Servicios Adicionales (El estilo Booking) */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-serif text-white mb-4">Servicios Adicionales</h3>
            <ul className="space-y-4">
                <li>
                    <a href="#" className="flex items-center justify-between text-gray-300 hover:text-luxe-gold transition-colors">
                        <span>🏨 Buscar Hoteles Exclusivos</span>
                        <span>→</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center justify-between text-gray-300 hover:text-luxe-gold transition-colors">
                        <span>🚗 Alquilar Vehículo de Lujo</span>
                        <span>→</span>
                    </a>
                </li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-luxe-gold font-serif text-lg mb-4">Resumen</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex justify-between"><span>Duración:</span> <span className="text-white">{trip.days} Días</span></li>
              <li className="flex justify-between"><span>Viajeros:</span> <span className="text-white">{trip.travelers}</span></li>
              <li className="flex justify-between"><span>Estilo:</span> <span className="text-white">{trip.budget}</span></li>
            </ul>
          </div>
        </div>

        {/* Columna Derecha: Línea de Tiempo */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-2xl font-serif mb-4">Itinerario Diario</h3>
          
          {itinerary.dailyPlan && itinerary.dailyPlan.map((day, index) => (
            <div key={index} className="relative pl-8 border-l border-luxe-gold/30 pb-8 last:pb-0 group">
              <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 bg-luxe-gold rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
              
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <h4 className="text-xl font-bold text-white mb-2">Día {day.day}</h4>
                <p className="text-gray-300 leading-relaxed">
                  {day.activity}
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 bg-black/30 rounded text-xs text-gray-400">Mañana</span>
                  <span className="px-2 py-1 bg-black/30 rounded text-xs text-gray-400">Tarde</span>
                  <span className="px-2 py-1 bg-black/30 rounded text-xs text-gray-400">Noche</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12 text-gray-700 text-xs">Desarrollado con React, Node.js y Gemini AI.</div>

    </div>
  );
};

export default TripDetails;