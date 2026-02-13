
import React, { useMemo } from 'react';
import { Cliente } from '../types';
import { formatCurrency } from '../constants';
import { DollarSign, Wallet, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface HeaderCardsProps {
  clientes: Cliente[];
}

const HeaderCards: React.FC<HeaderCardsProps> = ({ clientes }) => {
  const metrics = useMemo(() => {
    const totalFaturamento = clientes.reduce((acc, curr) => acc + curr.valorTotal, 0);
    const totalRecebido = clientes.reduce((acc, curr) => acc + curr.valorPago, 0);
    const totalPendente = totalFaturamento - totalRecebido;
    
    const clientesConcluidos = clientes.filter(c => c.status === 'concluido' || c.status === 'confirmado').length;
    const clientesTotalValidos = clientes.filter(c => c.status !== 'cancelado').length;
    const taxaConversao = clientesTotalValidos > 0 
      ? (clientesConcluidos / clientesTotalValidos) * 100 
      : 0;

    return {
      faturamento: totalFaturamento,
      recebido: totalRecebido,
      pendente: totalPendente,
      conversao: taxaConversao
    };
  }, [clientes]);

  const Card = ({ title, value, subtext, icon: Icon, colorTheme, trend }: any) => {
    const themes: any = {
      primary: 'bg-blue-50 text-blue-600',
      success: 'bg-emerald-50 text-emerald-600',
      danger: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600',
    };
    
    const borderTheme: any = {
      primary: 'border-b-4 border-blue-500',
      success: 'border-b-4 border-emerald-500',
      danger: 'border-b-4 border-red-500',
      purple: 'border-b-4 border-purple-500',
    };

    return (
      <div className={`bg-white rounded-2xl shadow-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group border border-slate-100`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${themes[colorTheme]} transition-transform group-hover:scale-110 duration-300`}>
             <Icon size={24} strokeWidth={2.5} />
          </div>
          {trend && (
             <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {trend === 'up' ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                <span>12%</span>
             </div>
          )}
        </div>
        
        <div>
           <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
           <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
           <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Card 
        title="Faturamento Total" 
        value={formatCurrency(metrics.faturamento)} 
        subtext="Valor total acumulado"
        icon={DollarSign}
        colorTheme="primary"
        trend="up"
      />
      <Card 
        title="Valor Recebido" 
        value={formatCurrency(metrics.recebido)} 
        subtext="Entradas confirmadas"
        icon={Wallet}
        colorTheme="success"
        trend="up"
      />
      <Card 
        title="Pendente" 
        value={formatCurrency(metrics.pendente)} 
        subtext="A receber de clientes"
        icon={AlertCircle}
        colorTheme="danger"
        trend="down"
      />
      <Card 
        title="Taxa de Conversão" 
        value={`${metrics.conversao.toFixed(1)}%`} 
        subtext="Eficácia de vendas"
        icon={TrendingUp}
        colorTheme="purple"
      />
    </div>
  );
};

export default HeaderCards;
