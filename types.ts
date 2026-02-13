export type StatusCliente = 'aguardando' | 'confirmado' | 'concluido' | 'cancelado';

export interface Cliente {
  id: string;
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
  coords?: { lat: number; lng: number };
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