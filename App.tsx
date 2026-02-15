import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_CLIENTES, generateId } from './constants';
import { Cliente, StatusCliente, Configuracoes, User } from './types';
import Sidebar from './components/Sidebar';
import HeaderCards from './components/HeaderCards';
import StatsGrid from './components/StatsGrid';
import ClientesList from './components/ClientesList';
import AgendaAtendimentos from './components/AgendaAtendimentos';
import FinanceiroView from './components/FinanceiroView';
import ConfiguracoesPage from './components/Configuracoes.tsx';
import FormCliente from './components/FormCliente';
import Login from './components/Login';
import { Plus, Menu } from 'lucide-react';

const App: React.FC = () => {
  // Autenticação e Usuário Atual
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mag_system_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Estado dos Clientes (Somente do usuário atual)
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Configurações (Somente do usuário atual)
  const [config, setConfig] = useState<Configuracoes>({
    nomeEmpresa: 'Mag System',
    email: 'contato@magsystem.com.br',
    telefone: '(11) 99999-9999',
    logoUrl: null
  });

  const [activeSection, setActiveSection] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Carregar dados quando o usuário muda (Login ou Page Load)
  useEffect(() => {
    if (currentUser) {
      // 1. Carregar Clientes Globais
      const allClientsStr = localStorage.getItem('mag_system_clientes');
      const allClients: Cliente[] = allClientsStr ? JSON.parse(allClientsStr) : [];
      
      // 2. Filtrar apenas os do usuário
      const myClients = allClients.filter(c => c.userId === currentUser.id);
      setClientes(myClients);

      // 3. Carregar Configuração do Usuário
      const configKey = `mag_system_config_${currentUser.id}`;
      const savedConfig = localStorage.getItem(configKey);
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // Reset config se não houver
        setConfig({
          nomeEmpresa: 'Mag System',
          email: currentUser.email,
          telefone: '',
          logoUrl: null
        });
      }
    } else {
      setClientes([]);
    }
  }, [currentUser]);

  // Função para salvar clientes no Storage Global preservando dados de outros usuários
  const saveClientsToStorage = (newClientList: Cliente[]) => {
    if (!currentUser) return;

    // 1. Pegar todos os clientes do storage
    const allClientsStr = localStorage.getItem('mag_system_clientes');
    const allClients: Cliente[] = allClientsStr ? JSON.parse(allClientsStr) : [];

    // 2. Remover os clientes antigos deste usuário da lista global
    const otherUsersClients = allClients.filter(c => c.userId !== currentUser.id);

    // 3. Combinar (Outros + Novos deste usuário)
    const updatedGlobalList = [...otherUsersClients, ...newClientList];

    // 4. Salvar
    localStorage.setItem('mag_system_clientes', JSON.stringify(updatedGlobalList));
  };

  // Handler de Login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mag_system_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mag_system_current_user');
    setClientes([]);
    setActiveSection('dashboard');
  };

  // Handlers de Clientes
  const handleSaveCliente = (clienteData: Cliente) => {
    if (!currentUser) return;

    // Garantir que o cliente tenha o ID do usuário atual
    const clienteSalvo = { ...clienteData, userId: currentUser.id };

    const newClientList = [...clientes];
    const index = newClientList.findIndex(c => c.id === clienteSalvo.id);
    
    if (index >= 0) {
      newClientList[index] = clienteSalvo;
    } else {
      newClientList.push(clienteSalvo);
    }

    setClientes(newClientList);
    saveClientsToStorage(newClientList); // Persistência

    setShowForm(false);
    setEditingClient(null);
  };

  const handleEditClick = (cliente: Cliente) => {
    setEditingClient(cliente);
    setShowForm(true);
  };

  const handleUpdateStatus = (id: string, newStatus: StatusCliente) => {
    const updatedList = clientes.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    );
    setClientes(updatedList);
    saveClientsToStorage(updatedList);
  };

  const handleFinalizeClient = (id: string) => {
    const updatedList = clientes.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'concluido' as StatusCliente,
          valorPago: c.valorTotal,
          valorRestante: 0,
          percentualPago: 100
        };
      }
      return c;
    });
    setClientes(updatedList);
    saveClientsToStorage(updatedList);
  };

  const handleImportCSV = (file: File) => {
    if (!currentUser) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text) return;

        const lines = text.split('\n');
        const newClients: Cliente[] = [];

        // Ignorar cabeçalho (i=1)
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            
            if (cols && cols.length >= 8) {
                const clean = (str: string) => str ? str.replace(/^"|"$/g, '').trim() : '';
                const valorTotal = parseFloat(clean(cols[5])) || 0;
                const valorPago = parseFloat(clean(cols[6])) || 0;

                const novo: Cliente = {
                    id: generateId(), 
                    userId: currentUser.id, // VINCULAR AO USUARIO ATUAL
                    nome: clean(cols[1]),
                    telefone: clean(cols[2]),
                    whatsapp: clean(cols[3]),
                    servico: clean(cols[4]),
                    valorTotal: valorTotal,
                    valorPago: valorPago,
                    valorRestante: valorTotal - valorPago,
                    percentualPago: valorTotal > 0 ? Math.round((valorPago / valorTotal) * 100) : 0,
                    dataAtendimento: clean(cols[7]),
                    status: (clean(cols[8]) as StatusCliente) || 'aguardando',
                    cidade: clean(cols[9]) || 'João Pessoa',
                    endereco: clean(cols[10]) || '',
                    observacoes: clean(cols[11]) || ''
                };
                newClients.push(novo);
            }
        }

        if (newClients.length > 0) {
            const updatedList = [...clientes, ...newClients];
            setClientes(updatedList);
            saveClientsToStorage(updatedList);
            alert(`${newClients.length} clientes importados com sucesso!`);
        } else {
            alert('Não foi possível ler os dados do arquivo CSV.');
        }
    };
    reader.readAsText(file);
  };

  const handleConfigSave = (newConfig: Configuracoes) => {
    if (!currentUser) return;
    setConfig(newConfig);
    localStorage.setItem(`mag_system_config_${currentUser.id}`, JSON.stringify(newConfig));
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

  // RENDERIZAÇÃO CONDICIONAL DE LOGIN
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

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
              <AgendaAtendimentos clientes={clientes} onEdit={handleEditClick} />
            </div>

            {/* Seção 3: Dados e Lista */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               {/* Coluna Principal: Lista de Clientes */}
               <div className="xl:col-span-2 space-y-4">
                  <ClientesList 
                      title="Atendimentos Recentes" 
                      clientes={activeClients.slice(0, 5)} 
                      onUpdateStatus={handleUpdateStatus}
                      onFinalize={handleFinalizeClient}
                      onEdit={handleEditClick}
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
                  onClick={() => {
                    setEditingClient(null);
                    setShowForm(true);
                  }}
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
                onEdit={handleEditClick}
                onImport={handleImportCSV}
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
                onEdit={handleEditClick}
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
                <AgendaAtendimentos clientes={clientes} onEdit={handleEditClick} />
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
                <div className="mt-8 pt-8 border-t border-slate-200">
                    <button 
                        onClick={handleLogout}
                        className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-sm transition-colors w-full sm:w-auto"
                    >
                        Sair do Sistema
                    </button>
                </div>
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
        currentUser={currentUser}
        onLogout={handleLogout}
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
                currentUser={currentUser}
                onLogout={handleLogout}
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
        <FormCliente 
            onClose={() => {
                setShowForm(false);
                setEditingClient(null);
            }} 
            onSave={handleSaveCliente}
            initialData={editingClient}
        />
      )}
    </div>
  );
};

export default App;