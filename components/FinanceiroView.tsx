
import React, { useMemo } from 'react';
import { Cliente } from '../types';
import { formatCurrency } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface FinanceiroProps {
  clientes: Cliente[];
}

const FinanceiroView: React.FC<FinanceiroProps> = ({ clientes }) => {
  const data = useMemo(() => {
    const total = clientes.reduce((acc, c) => acc + c.valorTotal, 0);
    const recebido = clientes.reduce((acc, c) => acc + c.valorPago, 0);
    const pendente = total - recebido;
    
    // Pie Chart Data
    const pieData = [
      { name: 'Recebido', value: recebido, color: '#27AE60' }, // Success
      { name: 'Pendente', value: pendente, color: '#EB5757' }, // Danger
    ];

    // Simple Projection Data (Mocked based on client list for visualization)
    const activeClients = clientes
      .filter(c => c.status !== 'cancelado')
      .sort((a, b) => a.dataAtendimento.localeCompare(b.dataAtendimento));
    
    let cumulative = 0;
    const chartData = activeClients.map(c => {
        cumulative += c.valorTotal;
        return {
            name: c.nome.split(' ')[0], // First name for x-axis
            valor: cumulative,
            date: c.dataAtendimento
        };
    }).slice(0, 10); // Limit to 10 for cleaner chart

    return { total, recebido, pendente, pieData, chartData };
  }, [clientes]);

  const percentageRecebido = data.total > 0 ? Math.round((data.recebido / data.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Receita Total</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(data.total)}</h3>
            <div className="flex items-center mt-2 text-xs text-slate-400">
                <TrendingUp size={14} className="mr-1" />
                <span>Base total de contratos</span>
            </div>
        </div>
        <div className="bg-success-50 p-6 rounded-xl shadow-sm border border-success-100">
            <p className="text-sm text-success-600 mb-1 font-medium">Em Caixa (Recebido)</p>
            <h3 className="text-2xl font-bold text-success-700">{formatCurrency(data.recebido)}</h3>
            <div className="flex items-center mt-2 text-xs text-success-600">
                <ArrowUpRight size={14} className="mr-1" />
                <span>{percentageRecebido}% do total</span>
            </div>
        </div>
         <div className="bg-danger-50 p-6 rounded-xl shadow-sm border border-danger-100">
            <p className="text-sm text-danger-600 mb-1 font-medium">A Receber (Pendente)</p>
            <h3 className="text-2xl font-bold text-danger-700">{formatCurrency(data.pendente)}</h3>
            <div className="flex items-center mt-2 text-xs text-danger-600">
                <ArrowDownRight size={14} className="mr-1" />
                <span>{100 - percentageRecebido}% restante</span>
            </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Composição Financeira</h4>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Projection Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Projeção Acumulada</h4>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data.chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} tickFormatter={(val) => `R$${val/1000}k`} />
                        <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                        <Area type="monotone" dataKey="valor" stroke="#107FB7" fill="#107FB7" fillOpacity={0.1} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h4 className="text-lg font-bold text-slate-800">Detalhamento de Transações</h4>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Cliente</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Valor Total</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Pago</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Pendente</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Status Pagamento</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {clientes.map(client => (
                        <tr key={client.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{client.nome}</td>
                            <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{formatCurrency(client.valorTotal)}</td>
                            <td className="px-6 py-4 text-success-600 font-medium whitespace-nowrap">{formatCurrency(client.valorPago)}</td>
                            <td className="px-6 py-4 text-danger-500 whitespace-nowrap">{formatCurrency(client.valorRestante)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {client.percentualPago === 100 ? (
                                    <span className="text-xs font-bold text-success-600 bg-success-100 px-2 py-1 rounded-full">100% Pago</span>
                                ) : client.percentualPago > 0 ? (
                                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Parcial ({client.percentualPago}%)</span>
                                ) : (
                                    <span className="text-xs font-bold text-danger-600 bg-danger-100 px-2 py-1 rounded-full">Pendente</span>
                                )}
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

export default FinanceiroView;
