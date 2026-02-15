import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Building2, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { generateId } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    // Simulação de processamento
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('mag_system_users') || '[]');

      if (isRegistering) {
        // Lógica de Registro
        const userExists = storedUsers.some((u: User) => u.email === email);
        
        if (userExists) {
          setError('Este e-mail já está cadastrado.');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: generateId(),
          name,
          email,
          password
        };

        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('mag_system_users', JSON.stringify(updatedUsers));
        
        setIsRegistering(false);
        setSuccessMsg('Conta criada com sucesso! Faça login.');
        setPassword(''); // Limpa senha para forçar login
        setIsLoading(false);

      } else {
        // Lógica de Login
        const user = storedUsers.find((u: User) => u.email === email && u.password === password);

        if (user) {
          onLogin(user);
        } else {
          setError('E-mail ou senha incorretos.');
          setIsLoading(false);
        }
      }
    }, 800);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccessMsg('');
    setName('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30 transform rotate-3">
              <Building2 className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mag System</h1>
            <p className="text-slate-500 text-sm mt-1">
              {isRegistering ? 'Crie sua conta para começar' : 'Faça login para gerenciar seu sistema'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-800 font-medium"
                    placeholder="Seu nome"
                    required={isRegistering}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-800 font-medium"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-800 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center animate-in slide-in-from-top-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg flex items-center animate-in slide-in-from-top-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                {successMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transform hover:-translate-y-0.5 transition-all flex items-center justify-center relative overflow-hidden"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegistering ? 'Cadastrar' : 'Entrar no Sistema'}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <button 
                onClick={toggleMode}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-all"
             >
                {isRegistering 
                  ? 'Já tem uma conta? Faça login' 
                  : 'Não tem conta? Crie agora'}
             </button>
             <p className="text-xs text-slate-400 mt-4">
               Mag System Oficial © {new Date().getFullYear()}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;