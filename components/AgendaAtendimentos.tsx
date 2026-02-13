
import React, { useMemo } from 'react';
import { Cliente } from '../types';
import { formatCurrency, formatDate } from '../constants';
import { Calendar, Clock, MessageCircle, MapPin, ChevronRight } from 'lucide-react';

interface AgendaProps {
  clientes: Cliente[];
}

const handleWhatsApp = (cliente: Cliente) => {
  const phone = cliente.whatsapp.replace(/\D/g, '');
  const message = `Olá ${cliente.nome}, lembrete do nosso agendamento de ${cliente.servico} para ${formatDate(cliente.dataAtendimento)}.`;
  window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

const openGoogleMaps = (endereco: string, cidade: string) => {
  const searchTerm = endereco ? `${endereco}, ${cidade} - PB` : `${cidade} - PB`;
  const query = encodeURIComponent(searchTerm);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
};

const AgendaCard: React.FC<{ cliente: Cliente, isToday?: boolean }> = ({ cliente, isToday }) => (
  <div className={`p-5 rounded-2xl border mb-3 transition-all duration-300 hover:shadow-lg group relative overflow-hidden ${
      isToday 
      ? 'bg-gradient-to-r from-white to-primary-50/50 border-primary-200' 
      : 'bg-white border-slate-100 hover:border-slate-200'
    }`}
  >
    {isToday && <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>}
    
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
       <div className="flex items-start gap-4 w-full">
          <div className={`
             w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm shadow-sm
             ${isToday ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}
          `}>
             <Clock size={20} strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-800 text-base truncate">{cliente.nome}</h4>
                {isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-wide">
                        Hoje
                    </span>
                )}
             </div>
             <p className="text-sm text-slate-500 font-medium mb-2">{cliente.servico}</p>
             
             <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                   <Calendar size={12} className="mr-1.5" />
                   <span className="font-semibold">{formatDate(cliente.dataAtendimento)}</span>
                </div>
                <button 
                  onClick={() => openGoogleMaps(cliente.endereco, cliente.cidade)}
                  className="flex items-center text-slate-400 hover:text-primary-600 transition-colors"
                >
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate max-w-[150px]">{cliente.cidade}</span>
                </button>
             </div>
          </div>
       </div>

       <button 
         onClick={() => handleWhatsApp(cliente)}
         className={`
           w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all
           ${isToday 
             ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
             : 'bg-slate-50 text-slate-600 hover:bg-success-50 hover:text-success-700'
            }
         `}
       >
          <MessageCircle size={16} />
          <span>Confirmar</span>
       </button>
    </div>
  </div>
);

const AgendaAtendimentos: React.FC<AgendaProps> = ({ clientes }) => {
  const { hoje, proximos7dias } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextWeekDate = new Date();
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    const nextWeekStr = nextWeekDate.toISOString().split('T')[0];

    const todayList = clientes.filter(c => c.dataAtendimento === todayStr && c.status !== 'concluido' && c.status !== 'cancelado');
    const weekList = clientes.filter(c => {
      return c.dataAtendimento > todayStr && c.dataAtendimento <= nextWeekStr && c.status !== 'concluido' && c.status !== 'cancelado';
    }).sort((a, b) => a.dataAtendimento.localeCompare(b.dataAtendimento));

    return { hoje: todayList, proximos7dias: weekList };
  }, [clientes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
            <Calendar size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Para Hoje</h3>
        </div>
        
        <div className="bg-white p-2 rounded-3xl shadow-soft border border-slate-100 min-h-[200px]">
          {hoje.length > 0 ? (
            <div className="p-2">
                 {hoje.map(c => <AgendaCard key={c.id} cliente={c} isToday />)}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                 <Clock className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">Tudo tranquilo por hoje!</p>
              <p className="text-xs text-slate-400 mt-1">Nenhum atendimento agendado.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <ChevronRight size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Próximos 7 Dias</h3>
        </div>

        <div className="bg-white p-2 rounded-3xl shadow-soft border border-slate-100 min-h-[200px]">
          {proximos7dias.length > 0 ? (
            <div className="p-2">
               {proximos7dias.map(c => <AgendaCard key={c.id} cliente={c} />)}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                 <Calendar className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">Agenda livre na semana.</p>
              <p className="text-xs text-slate-400 mt-1">Aproveite para prospectar novos clientes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendaAtendimentos;
