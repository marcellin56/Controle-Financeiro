
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  CalendarDays, 
  DollarSign, 
  Settings,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { Configuracoes } from '../types';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  config: Configuracoes;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, config, mobile, onCloseMobile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'atendidos', label: 'Concluídos', icon: CheckCircle },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const baseClasses = mobile 
    ? "fixed inset-y-0 left-0 w-72 bg-[#0f172a] text-white z-50 shadow-2xl transition-transform duration-300 ease-in-out"
    : "w-72 bg-[#0f172a] text-white flex flex-col h-full transition-all duration-300 shadow-2xl z-20 hidden md:flex relative border-r border-slate-800";

  return (
    <aside className={baseClasses}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="px-8 pt-10 pb-8 flex flex-col items-center relative z-10">
        {mobile && (
            <button 
                onClick={onCloseMobile}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/10 p-1 rounded-full"
            >
                <X size={20} />
            </button>
        )}

        <div className="relative group mb-5">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
            
            {config.logoUrl ? (
            <img 
                src={config.logoUrl} 
                alt="Logo" 
                className="w-20 h-20 object-contain drop-shadow-2xl relative z-10 transform transition-transform group-hover:scale-105" 
            />
            ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg relative z-10 transform group-hover:rotate-3 transition-all border border-white/10">
                MAG
            </div>
            )}
        </div>
        
        <h1 className="font-bold text-lg text-center tracking-tight text-white">
          {config.nomeEmpresa || 'Mag System'}
        </h1>
        <div className="flex items-center mt-1 space-x-1">
          <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Online</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Menu Principal</p>
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary-400'} transition-colors duration-300`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  
                  {isActive && (
                     <ChevronRight size={16} className="text-white/50" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
           <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <div>
                <p className="text-xs font-bold text-white">Admin User</p>
                <p className="text-[10px] text-slate-400">Gerente</p>
              </div>
           </div>
           <button className="w-full flex items-center justify-center space-x-2 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-xs font-medium border border-transparent hover:border-white/10">
            <LogOut size={14} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
