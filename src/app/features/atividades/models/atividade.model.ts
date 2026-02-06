export interface Atividade {
  id: string;
  titulo: string;
  descricao?: string;
  disciplinaId?: string;
  disciplinaNome?: string;
  disciplinaCor?: string;
  tipo: 'prova' | 'trabalho' | 'estudo' | 'seminario' | 'outro';
  dataEntrega?: Date;
  horaEntrega?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'a-fazer' | 'em-andamento' | 'concluida';
  lembreteIA?: boolean;
  anotacoes?: string;
  concluida: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TIPOS_ATIVIDADE = [
  { value: 'prova', label: 'Prova', icon: 'warning', emoji: '🚨' },
  { value: 'trabalho', label: 'Trabalho', icon: 'description', emoji: '📝' },
  { value: 'seminario', label: 'Seminário', icon: 'translate', emoji: '🗣️' },
  { value: 'estudo', label: 'Estudo', icon: 'book', emoji: '📚' },
  { value: 'outro', label: 'Outro', icon: 'push_pin', emoji: '📌' },
] as const;

export const PRIORIDADES = [
  { value: 'baixa', label: 'Baixa', color: 'text-emerald-600' },
  { value: 'media', label: 'Média', color: 'text-amber-600' },
  { value: 'alta', label: 'Alta', color: 'text-red-600' },
] as const;

export const STATUS_ATIVIDADE = [
  { value: 'a-fazer', label: 'A Fazer' },
  { value: 'em-andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
] as const;
