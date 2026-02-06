export interface Evento {
  id?: string;
  titulo: string;
  disciplinaId?: string;
  disciplinaNome?: string;
  disciplinaCor?: string;
  tipo: 'aula' | 'prova' | 'entrega' | 'outro';
  dataInicio: Date;
  dataFim: Date;
  horaInicio: string;
  horaFim: string;
  local?: string;
  sala?: string;
  descricao?: string;
  recorrente?: boolean;
  recorrenciaDias?: ('seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab')[];
  createdAt?: Date;
}

export const TIPOS_EVENTO = [
  { value: 'aula' as const, label: 'Aula', icon: 'school', color: 'blue' },
  { value: 'prova' as const, label: 'Prova', icon: 'quiz', color: 'red' },
  { value: 'entrega' as const, label: 'Entrega', icon: 'assignment_turned_in', color: 'amber' },
  { value: 'outro' as const, label: 'Outro', icon: 'event', color: 'purple' },
];
