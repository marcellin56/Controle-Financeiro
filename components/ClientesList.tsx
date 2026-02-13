
import React from 'react';
import { Cliente, StatusCliente } from '../types';
import { formatCurrency, formatDate } from '../constants';
import { MessageCircle, Check, MapPin, Calendar, CheckCheck, MoreHorizontal, ArrowRight } from 'lucide-react';

interface ClientesListProps {
  clientes: Cliente[];
  onUpdateStatus: (id: string, newStatus: StatusCliente) => void;
  onFinalize?: (id: string) => void;
  title: string;
  readOnly?: boolean;
}

const handleWhatsApp = (cliente: Cliente) => {
  const phone = cliente.whatsapp.replace(/\D/g, '');
  const message = `Olá ${cliente.nome}, tudo bem? Entro em contato sobre o serviço de ${cliente.servico}.`;
  window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

const openGoogleMaps = (endereco: string, cidade: string) => {
  const searchTerm = endereco ? `${endereco}, ${cidade} - PB` : `${cidade} - PB`;
  const query = encodeURIComponent(searchTerm);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const getStatusBadge = (status: StatusCliente) => {
  const styles = {
    aguardando: 'bg-amber-50 text-amber-600 ring-amber-500/20',
    confirmado: 'bg-blue-50 text-blue-600 ring-blue-500/20',
    concluido: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20',
    cancelado: 'bg-red-50 text-red-600 ring-red-500/20'
  };
  
  const labels = {
    aguardando: 'Aguardando',
    confirmado: 'Confirmado',
    concluido: 'Concluído',
    cancelado: 'Cancelado'
  };

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full ring-1 ring-inset ${styles[status]} inline-flex items-center gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'aguardando' ? 'bg-amber-500' : status === 'confirmado' ? 'bg-blue-500' : status === 'concluido' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
      {labels[status]}
    </span>
  );
};

// ... MobileCard component mantido com estilos similares atualizados ...
interface MobileCardProps {
  cliente: Cliente;
  onUpdateStatus: (id: string, newStatus: StatusCliente) => void;
  onFinalize?: (id: string) => void;
  readOnly: boolean;
}

const MobileCard: React.FC<MobileCardProps> = ({ cliente, onUpdateStatus, onFinalize, readOnly }) => (
  <div className="bg-white rounded-2xl shadow-soft p-5 mb-4 border border-slate-100 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
            {getInitials(cliente.nome)}
         </div>
         <div>
            <h4 className="font-bold text-slate-800 text-base">{cliente.nome}</h4>
            <p className="text-xs text-slate-500 font-medium">{cliente.servico}</p>
         </div>
      </div>
      {getStatusBadge(cliente.status)}
    </div>

    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-50">
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Data</span>
            <div className="flex items-center text-sm font-medium text-slate-700 mt-1">
                <Calendar size={14} className="mr-1.5 text-slate-400" />
                {formatDate(cliente.dataAtendimento)}
            </div>
        </div>
        <div className="flex flex-col">
             <span className="text-[10px] text-slate-400 font-semibold uppercase">Local</span>
             <button 
                onClick={() => openGoogleMaps(cliente.endereco, cliente.cidade)}
                className="flex items-center text-sm font-medium text-primary-600 mt-1 truncate"
              >
                  <MapPin size={14} className="mr-1.5 shrink-0" />
                  {cliente.cidade}
              </button>
        </div>
    </div>

    <div className="bg-slate-50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-500">Pagamento</span>
          <span className="text-xs font-bold text-slate-700">{cliente.percentualPago}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              cliente.percentualPago >= 100 ? 'bg-success-500' : 
              cliente.percentualPago >= 50 ? 'bg-primary-500' : 'bg-amber-400'
            }`} 
            style={{ width: `${cliente.percentualPago}%` }}
          ></div>
      </div>
      <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500">Total: {formatCurrency(cliente.valorTotal)}</span>
          <span className={`${cliente.valorRestante > 0 ? 'text-danger-600' : 'text-success-600'}`}>
            {cliente.valorRestante > 0 ? `Resta: ${formatCurrency(cliente.valorRestante)}` : 'Quitado'}
          </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => handleWhatsApp(cliente)}
        className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-success-600 hover:border-success-200 hover:bg-success-50 rounded-xl font-semibold transition-all text-sm"
      >
        <MessageCircle size={18} />
        WhatsApp
      </button>
      {!readOnly && cliente.status !== 'concluido' && (
        <button 
          onClick={() => onFinalize ? onFinalize(cliente.id) : onUpdateStatus(cliente.id, 'concluido')}
          className="flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 text-sm"
        >
          {onFinalize ? <CheckCheck size={18} /> : <Check size={18} />}
          {onFinalize ? "Finalizar" : "Concluir"}
        </button>
      )}
    </div>
  </div>
);

const ClientesList: React.FC<ClientesListProps> = ({ clientes, onUpdateStatus, onFinalize, title, readOnly = false }) => {
  if (clientes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6 border border-slate-100">
            <Calendar className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Nenhum registro encontrado</h3>
        <p className="text-slate-500 mt-2 max-w-xs mx-auto">Não há clientes nesta lista no momento. Adicione um novo cliente para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
         <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
         <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {clientes.length} Registros
         </span>
      </div>
      
      {/* Mobile View */}
      <div className="block lg:hidden">
        {clientes.map(cliente => (
            <MobileCard 
              key={cliente.id} 
              cliente={cliente} 
              onUpdateStatus={onUpdateStatus}
              onFinalize={onFinalize}
              readOnly={readOnly}
            />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Financeiro</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Pagamento</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 shrink-0">
                        {getInitials(cliente.nome)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{cliente.nome}</span>
                        <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-md w-fit mt-1">
                          {cliente.servico}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1">
                      <span className="text-slate-700 font-medium text-sm">{cliente.cidade || 'N/A'}</span>
                      <button 
                        onClick={() => openGoogleMaps(cliente.endereco, cliente.cidade)}
                        className="flex items-center text-xs text-slate-400 hover:text-primary-600 transition-colors group/addr w-fit"
                      >
                         <MapPin size={12} className="mr-1 group-hover/addr:text-primary-500" />
                         <span className="truncate max-w-[150px] group-hover/addr:underline">{cliente.endereco || 'Ver mapa'}</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-bold text-sm">{formatCurrency(cliente.valorTotal)}</span>
                      {cliente.valorRestante > 0 && (
                          <span className="text-xs text-danger-500 font-medium mt-0.5">
                            -{formatCurrency(cliente.valorRestante)}
                          </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[120px] mb-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          cliente.percentualPago >= 100 ? 'bg-success-500' : 
                          cliente.percentualPago >= 50 ? 'bg-primary-500' : 'bg-amber-400'
                        }`} 
                        style={{ width: `${cliente.percentualPago}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{cliente.percentualPago}% Quitado</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 whitespace-nowrap font-medium">
                    {formatDate(cliente.dataAtendimento)}
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(cliente.status)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleWhatsApp(cliente)}
                        className="p-2 text-slate-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-all"
                        title="WhatsApp"
                      >
                        <MessageCircle size={18} />
                      </button>
                      {!readOnly && cliente.status !== 'concluido' && (
                        <button 
                          onClick={() => onFinalize ? onFinalize(cliente.id) : onUpdateStatus(cliente.id, 'concluido')}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all
                            ${onFinalize 
                                ? 'bg-slate-900 text-white hover:bg-black hover:shadow-lg' 
                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                            }
                          `}
                        >
                          {onFinalize ? (
                            <>
                                <CheckCheck size={14} />
                                <span>Finalizar</span>
                            </>
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientesList;
