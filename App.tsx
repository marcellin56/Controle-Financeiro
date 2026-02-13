import React, { useState, useMemo } from 'react';
import { MOCK_CLIENTES } from './constants';
import { Cliente, StatusCliente, Configuracoes } from './types';
import Sidebar from './components/Sidebar';
import HeaderCards from './components/HeaderCards';
import StatsGrid from './components/StatsGrid';
import ClientesList from './components/ClientesList';
import AgendaAtendimentos from './components/AgendaAtendimentos';
import FinanceiroView from './components/FinanceiroView';
import ConfiguracoesPage from './components/Configuracoes.tsx';
import FormCliente from './components/FormCliente';
import { Plus, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [config, setConfig] = useState<Configuracoes>({
    nomeEmpresa: 'Mag System',
    email: 'contato@magsystem.com.br',
    telefone: '(11) 99999-9999',
    logoUrl: null
  });

  const handleAddCliente = (novoCliente: Cliente) => {
    setClientes(prev => [...prev, novoCliente]);
    setShowForm(false);
  };

  const handleUpdateStatus = (id: string, newStatus: StatusCliente) => {
    setClientes(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  // Função para finalizar serviço e realizar pagamento completo (quitação)
  const handleFinalizeClient = (id: string) => {
    setClientes(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'concluido',
          valorPago: c.valorTotal, // Pagamento completo
          valorRestante: 0,        // Zera pendência
          percentualPago: 100      // 100% pago
        };
      }
      return c;
    }));
  };

  const handleConfigSave = (newConfig: Configuracoes) => {
    setConfig(newConfig);
  };

  // Derived State
  const activeClients = useMemo(() => 
    clientes.filter(c => c.status !== 'concluido' && c.status !== 'cancelado'), 
  [clientes]);

  const completedClients = useMemo(() => 
    clientes.filter(c => c.status === 'concluido'), 
  [clientes]);

  const systemStats = useMemo(() => ({
    total: clientes.length,
    concluidos: completedClients.length,
    ativos: activeClients.length,
    faturamento: clientes.reduce((acc, c) => acc + c.valorTotal, 0)
  }), [clientes, completedClients, activeClients]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Seção 1: Indicadores Principais */}
            <HeaderCards clientes={clientes} />
            
            {/* Seção 2: Agenda */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   📅 Agenda e Prazos
                </h3>
                <button 
                  onClick={() => setActiveSection('agenda')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-bold hover:underline transition-all"
                >
                  Ver tudo &rarr;
                </button>
              </div>
              <AgendaAtendimentos clientes={clientes} />
            </div>

            {/* Seção 3: Dados Analíticos e Lista Recente */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Coluna Principal: Lista de Clientes */}
              <div className="xl:col-span-2 space-y-6">
                <ClientesList 
                    title="Atendimentos Recentes" 
                    clientes={activeClients.slice(0, 5)} 
                    onUpdateStatus={handleUpdateStatus}
                    onFinalize={handleFinalizeClient}
                />
              </div>
              
              {/* Coluna Lateral: Estatísticas */}
              <div className="xl:col-span-1">
                 <div className="sticky top-6">
                   <StatsGrid clientes={clientes} />
                 </div>
              </div>
            </div>
          </div>
        );
      case 'clientes':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gerenciamento de Clientes</h2>
                    <p className="text-slate-500 text-sm">Gerencie seus contratos e acompanhe o status.</p>
                </div>
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-success-500 hover:bg-success-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center font-medium shadow-lg shadow-success-500/30 hover:shadow-success-500/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  <Plus size={20} className="mr-2" />
                  Novo Cliente
                </button>
             </div>
             <ClientesList 
                title="Todos os Clientes Ativos" 
                clientes={activeClients} 
                onUpdateStatus={handleUpdateStatus}
                onFinalize={handleFinalizeClient}
             />
          </div>
        );
      case 'atendidos':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
                <h2 className="text-2xl font-bold text-slate-800">Histórico de Atendimentos</h2>
                <p className="text-slate-500 text-sm">Consulte serviços finalizados e histórico de pagamentos.</p>
             </div>
             <ClientesList 
                title="Clientes Concluídos" 
                clientes={completedClients} 
                onUpdateStatus={handleUpdateStatus} 
                readOnly
             />
          </div>
        );
      case 'agenda':
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Agenda de Atendimentos</h2>
                    <p className="text-slate-500 text-sm">Planeje sua semana e não perca prazos.</p>
                </div>
                <AgendaAtendimentos clientes={clientes} />
            </div>
        );
      case 'financeiro':
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Controle Financeiro</h2>
                    <p className="text-slate-500 text-sm">Acompanhe seu fluxo de caixa e previsões.</p>
                </div>
                <FinanceiroView clientes={clientes} />
            </div>
        );
      case 'configuracoes':
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
                    <p className="text-slate-500 text-sm">Personalize os dados da sua empresa no sistema.</p>
                </div>
                <ConfiguracoesPage config={config} onSave={handleConfigSave} stats={systemStats} />
            </div>
        );
      default:
        return <div>Seção não encontrada</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={(section) => {
            setActiveSection(section);
            setMobileMenuOpen(false);
        }} 
        config={config} 
      />

      {/* Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-0 z-50 transform transition-all duration-300 md:hidden ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        {/* Sidebar Content */}
        <div className={`absolute top-0 left-0 h-full w-72 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
             <Sidebar 
                activeSection={activeSection} 
                onNavigate={(s) => {setActiveSection(s); setMobileMenuOpen(false);}} 
                config={config} 
                mobile
                onCloseMobile={() => setMobileMenuOpen(false)}
            />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center md:hidden sticky top-0 z-10 shadow-sm">
           <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                 <Menu size={24} />
              </button>
              <span className="font-bold text-lg text-slate-800 ml-2 truncate max-w-[200px]">{config.nomeEmpresa}</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                MAG
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-10 w-full">
           <div className="max-w-7xl mx-auto w-full pb-10">
               {renderContent()}
           </div>
        </div>
      </main>

      {showForm && (
        <FormCliente onClose={() => setShowForm(false)} onSave={handleAddCliente} />
      )}
    </div>
  );
};

export default App;