import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Cliente } from '../types';
import { MapPin } from 'lucide-react';
import { formatCurrency, formatDate } from '../constants';

interface MapaParaibaProps {
  clientes: Cliente[];
}

// Criar ícone customizado usando HTML/CSS para evitar problemas com assets do Leaflet
const createCustomIcon = (status: string) => {
  let colorClass = 'bg-slate-500';
  if (status === 'confirmado') colorClass = 'bg-blue-500';
  if (status === 'concluido') colorClass = 'bg-emerald-500';
  if (status === 'cancelado') colorClass = 'bg-red-500';
  if (status === 'aguardando') colorClass = 'bg-amber-500';

  return L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-6 h-6 ${colorClass} rounded-full border-2 border-white shadow-md flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const MapaParaiba: React.FC<MapaParaibaProps> = ({ clientes }) => {
  // Centro da Paraíba aproximado
  const centerPosition: [number, number] = [-7.12, -36.5];
  
  // Filtrar clientes que têm coordenadas
  const clientesComCoords = clientes.filter(c => c.coords && c.status !== 'cancelado');

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {clientesComCoords.map(cliente => (
          <Marker 
            key={cliente.id} 
            position={[cliente.coords!.lat, cliente.coords!.lng]}
            icon={createCustomIcon(cliente.status)}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-slate-800">{cliente.nome}</h3>
                <p className="text-xs text-slate-500 mb-2">{cliente.cidade}</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Serviço:</span> {cliente.servico}</p>
                  <p><span className="font-semibold">Data:</span> {formatDate(cliente.dataAtendimento)}</p>
                  <p><span className="font-semibold">Valor:</span> {formatCurrency(cliente.valorTotal)}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1
                    ${cliente.status === 'confirmado' ? 'bg-blue-100 text-blue-700' : ''}
                    ${cliente.status === 'concluido' ? 'bg-emerald-100 text-emerald-700' : ''}
                    ${cliente.status === 'aguardando' ? 'bg-amber-100 text-amber-700' : ''}
                  `}>
                    {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaParaiba;