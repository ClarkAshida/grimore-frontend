export interface Disciplina {
  id?: string;
  codigo?: string;
  nome: string;
  professor?: string;
  cargaHoraria: number;
  cor: string;
  frequencia: number;
  faltas: number;
  status: 'ativa' | 'arquivada' | 'este-semestre';
  horarios: HorarioDisciplina[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HorarioDisciplina {
  diaSemana: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab';
  turno: 'manha' | 'tarde' | 'noite';
  horaInicio: string;
  horaFim: string;
}

export const CORES_DISCIPLINA = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'red', label: 'Vermelho', class: 'bg-red-500' },
  { value: 'amber', label: 'Laranja', class: 'bg-amber-500' },
  { value: 'emerald', label: 'Verde', class: 'bg-emerald-500' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-500' },
  { value: 'violet', label: 'Violeta', class: 'bg-violet-500' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
];

export const DIAS_SEMANA = [
  { value: 'seg' as const, label: 'Seg' },
  { value: 'ter' as const, label: 'Ter' },
  { value: 'qua' as const, label: 'Qua' },
  { value: 'qui' as const, label: 'Qui' },
  { value: 'sex' as const, label: 'Sex' },
  { value: 'sab' as const, label: 'Sáb' },
];
