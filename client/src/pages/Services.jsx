import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal'; // Importamos la animación

const Services = () => {
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' o 'cars'
  const [searchTerm, setSearchTerm] = useState('');

  // Datos simulados (Mock Data) para que parezca real
  const mockHotels = [
    { id: 1, name: "The Grand Ritz", location: "París, Francia", price: "450€", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Ocean View Resort", location: "Maldivas", price: "890€", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Alpine Lodge", location: "Suiza", price: "320€", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" },
  ];

  const mockCars = [
    { id: 1, name: "Porsche 911 Carrera", type: "Deportivo", price: "250€/día", img: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Range Rover Sport", type: "SUV Lujo", price: "180€/día", img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Tesla Model S", type: "Eléctrico", price: "150€/día", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80" },
  ];

  const data = activeTab === 'hotels' ? mockHotels : mockCars;

  return (
    <div className="min-h-screen bg-luxe-black text-white font-sans">
      
      {/* Cabecera Hero */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luxe-black z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            alt="Luxury Travel"
        />
        <div className="relative z-20 text-center">
            <h1 className="text-5xl font-serif text-luxe-gold mb-2">Concierge Services</h1>
            <p className="text-gray-300 tracking-widest uppercase text-sm">Hoteles & Vehículos Exclusivos</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        
        {/* Tabs de Navegación */}
        <div className="flex justify-center gap-8 mb-12">
            <button 
                onClick={() => setActiveTab('hotels')}
                className={`text-xl pb-2 border-b-2 transition-all ${activeTab === 'hotels' ? 'border-luxe-gold text-luxe-gold' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
                🏨 Hoteles
            </button>
            <button 
                onClick={() => setActiveTab('cars')}
                className={`text-xl pb-2 border-b-2 transition-all ${activeTab === 'cars' ? 'border-luxe-gold text-luxe-gold' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
                🚗 Vehículos
            </button>
        </div>

        {/* Buscador */}
        <div className="flex gap-4 mb-12 max-w-2xl mx-auto">
            <input 
                type="text" 
                placeholder={`Buscar ${activeTab === 'hotels' ? 'hotel o ciudad' : 'modelo de coche'}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-luxe-gold transition-colors"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-luxe-gold text-luxe-black font-bold px-8 py-3 rounded-full hover:bg-white transition-colors">
                Buscar
            </button>
        </div>

        {/* Grid de Resultados con Animación */}
        <div className="grid md:grid-cols-3 gap-8">
            {data.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.1}>
                    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-luxe-gold/50 transition-all group cursor-pointer h-full flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-xs font-bold text-luxe-gold backdrop-blur-sm">
                                {item.price}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-serif mb-1">{item.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{activeTab === 'hotels' ? item.location : item.type}</p>
                            </div>
                            <button className="w-full py-2 border border-white/20 rounded-lg hover:bg-luxe-gold hover:text-luxe-black hover:border-luxe-gold transition-all text-sm">
                                Reservar Ahora
                            </button>
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>

        <div className="mt-12 text-center">
            <Link to="/dashboard" className="text-gray-500 hover:text-luxe-gold underline">← Volver al Dashboard</Link>
        </div>

      </div>
    </div>
  );
};

export default Services;