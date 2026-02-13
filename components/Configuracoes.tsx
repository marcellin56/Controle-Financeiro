import React, { useRef } from 'react';
import { Configuracoes, Cliente } from '../types';
import { formatCurrency } from '../constants';
import { Upload, Trash2, Save, Building2, Mail, Phone } from 'lucide-react';

interface ConfiguracoesProps {
  config: Configuracoes;
  onSave: (newConfig: Configuracoes) => void;
  stats: {
    total: number;
    concluidos: number;
    ativos: number;
    faturamento: number;
  };
}

const ConfiguracoesPage: React.FC<ConfiguracoesProps> = ({ config, onSave, stats }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSave({ ...config, [name]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave({ ...config, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onSave({ ...config, logoUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Company Info Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Building2 className="mr-2 text-primary-500" />
          Informações da Empresa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logotipo</label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {config.logoUrl ? (
                    <img 
                      src={config.logoUrl} 
                      alt="Logo Preview" 
                      className="w-24 h-24 object-contain rounded-lg border border-slate-100" 
                    />
                  ) : (
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                      <Building2 className="text-slate-400" size={32} />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-3">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleLogoUpload} 
                    accept="image/png, image/jpeg, image/gif" 
                    className="hidden" 
                  />
                  <div className="flex gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center shadow-sm"
                    >
                        <Upload size={16} className="mr-2" />
                        Escolher Imagem
                    </button>
                    {config.logoUrl && (
                        <button 
                        onClick={removeLogo}
                        className="px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg text-sm font-medium transition-colors flex items-center"
                        >
                        <Trash2 size={16} className="mr-2" />
                        Remover
                        </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Max 5MB (PNG, JPG, GIF)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="nomeEmpresa" 
                  value={config.nomeEmpresa} 
                  onChange={handleInputChange} 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" 
                  placeholder="Ex: DKW Group"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Comercial</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  value={config.email} 
                  onChange={handleInputChange} 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" 
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="telefone" 
                  value={config.telefone} 
                  onChange={handleInputChange} 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" 
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="px-6 py-2 bg-success-500 text-white rounded-lg font-medium shadow-md hover:bg-success-600 transition-all flex items-center">
            <Save size={18} className="mr-2" />
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* System Stats Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Resumo do Sistema</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="p-4 bg-slate-50 rounded-lg text-center">
             <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Clientes</p>
             <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg text-center">
             <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Ativos</p>
             <p className="text-2xl font-bold text-primary-600">{stats.ativos}</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg text-center">
             <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Concluídos</p>
             <p className="text-2xl font-bold text-success-600">{stats.concluidos}</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg text-center">
             <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Faturamento</p>
             <p className="text-lg font-bold text-slate-800">{formatCurrency(stats.faturamento)}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;