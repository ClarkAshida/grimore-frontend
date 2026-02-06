import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Disciplina } from '../../models/disciplina.model';

@Component({
  selector: 'app-disciplinas-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './disciplinas-list.html',
  styleUrl: './disciplinas-list.css',
})
export class DisciplinasList {
  searchQuery = signal('');
  selectedFilter = signal<'todas' | 'ativas' | 'este-semestre' | 'arquivadas'>('todas');

  disciplinas = signal<Disciplina[]>([
    {
      id: '1',
      codigo: 'IMD1012',
      nome: 'Introdução às Técnicas de Programação',
      professor: 'Prof. Carlos Silva',
      cargaHoraria: 60,
      cor: 'blue',
      frequencia: 85,
      faltas: 4,
      status: 'ativa',
      horarios: [
        { diaSemana: 'seg', turno: 'manha', horaInicio: '08:00', horaFim: '10:00' },
        { diaSemana: 'qua', turno: 'manha', horaInicio: '08:00', horaFim: '10:00' },
      ],
    },
    {
      id: '2',
      codigo: 'MAT001',
      nome: 'Cálculo Diferencial e Integral I',
      professor: 'Prof. Ana Santos',
      cargaHoraria: 90,
      cor: 'amber',
      frequencia: 65,
      faltas: 12,
      status: 'ativa',
      horarios: [
        { diaSemana: 'ter', turno: 'tarde', horaInicio: '14:00', horaFim: '16:00' },
        { diaSemana: 'qui', turno: 'tarde', horaInicio: '14:00', horaFim: '16:00' },
      ],
    },
    {
      id: '3',
      codigo: 'IMD002',
      nome: 'Estrutura de Dados Básicas I',
      professor: 'Prof. Roberto Oliveira',
      cargaHoraria: 60,
      cor: 'violet',
      frequencia: 100,
      faltas: 0,
      status: 'ativa',
      horarios: [{ diaSemana: 'seg', turno: 'tarde', horaInicio: '16:00', horaFim: '18:00' }],
    },
    {
      id: '4',
      codigo: 'FIS101',
      nome: 'Física Mecânica',
      professor: 'Prof. Julia Mendes',
      cargaHoraria: 72,
      cor: 'red',
      frequencia: 50,
      faltas: 18,
      status: 'ativa',
      horarios: [{ diaSemana: 'qua', turno: 'noite', horaInicio: '18:00', horaFim: '20:00' }],
    },
    {
      id: '5',
      codigo: 'SOC042',
      nome: 'Sociologia do Trabalho',
      professor: 'Prof. Eduardo Lima',
      cargaHoraria: 45,
      cor: 'emerald',
      frequencia: 95,
      faltas: 2,
      status: 'ativa',
      horarios: [{ diaSemana: 'sex', turno: 'manha', horaInicio: '10:00', horaFim: '12:00' }],
    },
  ]);

  filteredDisciplinas = () => {
    let result = this.disciplinas();

    // Apply filter
    if (this.selectedFilter() !== 'todas') {
      result = result.filter((d) => d.status === this.selectedFilter());
    }

    // Apply search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (d) =>
          d.nome.toLowerCase().includes(query) ||
          d.codigo?.toLowerCase().includes(query) ||
          d.professor?.toLowerCase().includes(query),
      );
    }

    return result;
  };

  setFilter(filter: 'todas' | 'ativas' | 'este-semestre' | 'arquivadas') {
    this.selectedFilter.set(filter);
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  getCorClass(cor: string): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      amber: 'bg-amber-500',
      emerald: 'bg-emerald-500',
      indigo: 'bg-indigo-500',
      violet: 'bg-violet-500',
      pink: 'bg-pink-500',
    };
    return colorMap[cor] || 'bg-blue-500';
  }

  getCorBadgeClass(cor: string): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/30 text-[#3f70e4] dark:text-blue-300',
      red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300',
      amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300',
      violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300',
      pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300',
    };
    return colorMap[cor] || 'bg-blue-50 dark:bg-blue-900/30 text-[#3f70e4] dark:text-blue-300';
  }

  getStatusBadge(disciplina: Disciplina) {
    const frequencia = disciplina.frequencia;
    if (frequencia >= 80) {
      return {
        text: 'Presença Segura',
        class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      };
    } else if (frequencia >= 60) {
      return {
        text: 'Atenção às faltas',
        class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      };
    } else {
      return {
        text: 'Faltas Críticas',
        class: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
      };
    }
  }

  deleteDisciplina(id: string) {
    if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
      this.disciplinas.update((list) => list.filter((d) => d.id !== id));
    }
  }
}
