export type StatusCliente = 'aguardando' | 'confirmado' | 'concluido' | 'cancelado';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em um app real, nunca salve senhas em texto puro
}

export interface Cliente {
  id: string;
  userId: string; // Vincula o cliente a um usuário específico
  nome: string;
  telefone: string;
  whatsapp: string;
  servico: string;
  valorTotal: number;
  valorPago: number;
  valorRestante: number;
  percentualPago: number;
  dataAtendimento: string; // YYYY-MM-DD
  status: StatusCliente;
  cidade: string;
  endereco: string;
  observacoes?: string;
}

export interface Configuracoes {
  nomeEmpresa: string;
  email: string;
  telefone: string;
  logoUrl: string | null;
}

export interface ResumoFinanceiro {
  faturamentoTotal: number;
  valorRecebido: number;
  valorPendente: number;
  taxaConversao: number;
  totalClientes: number;
  clientesAtivos: number;
}