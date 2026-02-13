
import React, { useState, useEffect } from 'react';
import { Cliente, StatusCliente } from '../types';
import { generateId, CIDADES_PARAIBA } from '../constants';
import { X, Save } from 'lucide-react';

interface FormClienteProps {
  onClose: () => void;
  onSave: (cliente: Cliente) => void;
}

const FormCliente: React.FC<FormClienteProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    whatsapp: '',
    servico: '',
    valorTotal: 0,
    valorPago: 0,
    dataAtendimento: new Date().toISOString().split('T')[0],
    status: 'aguardando' as StatusCliente,
    cidade: 'João Pessoa',
    endereco: '',
    observacoes: ''
  });

  const [percentual, setPercentual] = useState(0);

  useEffect(() => {
    if (formData.valorTotal > 0) {
      setPercentual(Math.min(100, Math.round((formData.valorPago / formData.valorTotal) * 100)));
    } else {
      setPercentual(0);
    }
  }, [formData.valorTotal, formData.valorPago]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valorTotal' || name === 'valorPago' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valorRestante = formData.valorTotal - formData.valorPago;
    
    const novoCliente: Cliente = {
      id: generateId(),
      ...formData,
      valorRestante,
      percentualPago: percentual
    };

    onSave(novoCliente);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
      {/* Mobile: Full screen, Desktop: Rounded card */}
      <div className="bg-white w-full h-full md:h-auto md:rounded-xl shadow-2xl md:max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Novo Cliente</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Dados Pessoais</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                <input required name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                <input 
                  name="endereco" 
                  value={formData.endereco} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Rua, Número, Bairro" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade (PB) *</label>
                  <select 
                    name="cidade" 
                    value={formData.cidade} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  >
                    {CIDADES_PARAIBA.map(cidade => (
                      <option key={cidade.nome} value={cidade.nome}>{cidade.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp *</label>
                  <input type="tel" required name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Serviço e Financeiro */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Serviço & Financeiro</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Serviço *</label>
                <input 
                  required 
                  type="text"
                  name="servico" 
                  value={formData.servico} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Ex: Consultoria"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor Total (R$) *</label>
                  <input type="number" inputMode="decimal" min="0" required name="valorTotal" value={formData.valorTotal} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor Pago (R$)</label>
                  <input type="number" inputMode="decimal" min="0" max={formData.valorTotal} name="valorPago" value={formData.valorPago} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
              </div>
              
              {/* Progress Bar Preview */}
              <div className="bg-slate-100 rounded-lg p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Progresso do Pagamento</span>
                  <span className="font-bold text-slate-800">{percentual}%</span>
                </div>
                <div className="w-full bg-slate-300 rounded-full h-2">
                  <div className="bg-success-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percentual}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-slate-500">
                  <span>Faltam: R$ {formData.valorTotal - formData.valorPago}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data Atendimento *</label>
                <input type="date" required name="dataAtendimento" value={formData.dataAtendimento} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
                  <option value="aguardando">Aguardando</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="concluido">Concluído</option>
                </select>
             </div>
          </div>

          <div className="pb-4">
             <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
             <textarea rows={2} name="observacoes" value={formData.observacoes} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"></textarea>
          </div>

        </form>

        <div className="flex justify-end p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors mr-3">
              Cancelar
            </button>
            <button onClick={handleSubmit} type="button" className="px-6 py-2 bg-success-500 hover:bg-success-600 text-white rounded-lg font-medium shadow-md shadow-success-500/30 flex items-center space-x-2 transition-all">
              <Save size={18} />
              <span>Salvar</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default FormCliente;
