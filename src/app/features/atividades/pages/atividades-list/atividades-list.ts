import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Atividade, TIPOS_ATIVIDADE } from '../../models/atividade.model';

@Component({
  selector: 'app-atividades-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atividades-list.html',
  styleUrls: ['./atividades-list.css'],
})
export class AtividadesList implements OnInit {
  searchQuery = signal('');
  selectedFilter = signal<'todas' | 'a-fazer' | 'concluidas'>('todas');
  showDeleteModal = signal(false);
  atividadeToDelete = signal<string | null>(null);
  showActionsModal = signal(false);
  selectedAtividade = signal<Atividade | null>(null);

  // Mock data
  atividades = signal<Atividade[]>([
    {
      id: '1',
      titulo: 'Relatório de Física Quântica',
      descricao: 'Elaborar relatório completo sobre experimentos realizados.',
      disciplinaId: '1',
      disciplinaNome: 'Física III',
      disciplinaCor: 'red',
      tipo: 'trabalho',
      dataEntrega: new Date(2024, 9, 5), // 5 outubro
      horaEntrega: '23:59',
      prioridade: 'alta',
      status: 'a-fazer',
      concluida: false,
      createdAt: new Date(2024, 9, 2),
      updatedAt: new Date(2024, 9, 2),
    },
    {
      id: '2',
      titulo: 'Leitura Capítulo 4: Derivadas',
      descricao: 'Focar nos principais artistas e suas obras mais influentes.',
      disciplinaId: '2',
      disciplinaNome: 'Cálculo I',
      disciplinaCor: 'blue',
      tipo: 'estudo',
      dataEntrega: new Date(), // Hoje
      horaEntrega: '00:00',
      prioridade: 'media',
      status: 'a-fazer',
      concluida: false,
      createdAt: new Date(2024, 9, 1),
      updatedAt: new Date(2024, 9, 3),
    },
    {
      id: '3',
      titulo: 'Seminário de Genética',
      descricao: 'Apresentação sobre genética molecular.',
      disciplinaId: '3',
      disciplinaNome: 'Biologia',
      disciplinaCor: 'emerald',
      tipo: 'seminario',
      dataEntrega: new Date(2024, 9, 15), // 15 outubro
      horaEntrega: '10:00',
      prioridade: 'alta',
      status: 'a-fazer',
      concluida: false,
      createdAt: new Date(2024, 9, 1),
      updatedAt: new Date(2024, 9, 1),
    },
    {
      id: '4',
      titulo: 'Projeto Final de Estrutura de Dados',
      descricao: 'Implementar árvore binária de busca.',
      disciplinaId: '4',
      disciplinaNome: 'Programação II',
      disciplinaCor: 'violet',
      tipo: 'trabalho',
      dataEntrega: new Date(2024, 9, 20), // 20 outubro
      horaEntrega: '23:59',
      prioridade: 'alta',
      status: 'em-andamento',
      concluida: false,
      createdAt: new Date(2024, 8, 20),
      updatedAt: new Date(2024, 9, 3),
    },
    {
      id: '5',
      titulo: 'Quiz de História da Arte',
      descricao: '',
      disciplinaId: '5',
      disciplinaNome: 'História',
      disciplinaCor: 'amber',
      tipo: 'prova',
      dataEntrega: new Date(2024, 8, 28), // Passado
      horaEntrega: '14:00',
      prioridade: 'media',
      status: 'concluida',
      concluida: true,
      createdAt: new Date(2024, 8, 20),
      updatedAt: new Date(2024, 8, 29),
    },
  ]);

  constructor(private router: Router) {}

  ngOnInit() {}

  // Computed: Filtrar atividades
  filteredAtividades = computed(() => {
    let result = this.atividades();
    const query = this.searchQuery().toLowerCase();
    const filter = this.selectedFilter();

    // Filtrar por busca
    if (query) {
      result = result.filter(
        (a) =>
          a.titulo.toLowerCase().includes(query) ||
          a.disciplinaNome?.toLowerCase().includes(query) ||
          a.descricao?.toLowerCase().includes(query),
      );
    }

    // Filtrar por status
    if (filter === 'a-fazer') {
      result = result.filter((a) => !a.concluida);
    } else if (filter === 'concluidas') {
      result = result.filter((a) => a.concluida);
    }

    return result;
  });

  // Computed: Agrupar atividades
  atividadesAgrupadas = computed(() => {
    const atividades = this.filteredAtividades();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const proximaSemana = new Date(hoje);
    proximaSemana.setDate(hoje.getDate() + 7);

    const grupos = {
      hoje: [] as Atividade[],
      proximaSemana: [] as Atividade[],
      concluidas: [] as Atividade[],
      outras: [] as Atividade[],
    };

    atividades.forEach((atividade) => {
      if (atividade.concluida) {
        grupos.concluidas.push(atividade);
      } else if (atividade.dataEntrega) {
        const dataEntrega = new Date(atividade.dataEntrega);
        dataEntrega.setHours(0, 0, 0, 0);

        if (dataEntrega.getTime() === hoje.getTime()) {
          grupos.hoje.push(atividade);
        } else if (dataEntrega > hoje && dataEntrega <= proximaSemana) {
          grupos.proximaSemana.push(atividade);
        } else {
          grupos.outras.push(atividade);
        }
      } else {
        grupos.outras.push(atividade);
      }
    });

    return grupos;
  });

  // Computed: Contadores
  contadores = computed(() => {
    const todas = this.atividades();
    return {
      todas: todas.length,
      aFazer: todas.filter((a) => !a.concluida).length,
      concluidas: todas.filter((a) => a.concluida).length,
    };
  });

  setFilter(filter: 'todas' | 'a-fazer' | 'concluidas') {
    this.selectedFilter.set(filter);
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  getCorClass(cor: string): string {
    const cores: Record<string, string> = {
      blue: 'border-blue-500',
      red: 'border-red-500',
      amber: 'border-amber-500',
      emerald: 'border-emerald-500',
      indigo: 'border-indigo-500',
      violet: 'border-violet-500',
      pink: 'border-pink-500',
    };
    return cores[cor] || 'border-slate-500';
  }

  getCorBadgeClass(cor: string): string {
    const cores: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
      pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    };
    return cores[cor] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }

  getTipoInfo(tipo: string) {
    return TIPOS_ATIVIDADE.find((t) => t.value === tipo);
  }

  formatDate(date: Date): string {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataEntrega = new Date(date);
    dataEntrega.setHours(0, 0, 0, 0);

    if (dataEntrega.getTime() === hoje.getTime()) {
      return 'Hoje';
    }

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    if (dataEntrega.getTime() === amanha.getTime()) {
      return 'Amanhã';
    }

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return dataEntrega.toLocaleDateString('pt-BR', options);
  }

  isAtrasada(atividade: Atividade): boolean {
    if (atividade.concluida || !atividade.dataEntrega) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataEntrega = new Date(atividade.dataEntrega);
    dataEntrega.setHours(0, 0, 0, 0);
    return dataEntrega < hoje;
  }

  toggleConcluida(atividade: Atividade, event: Event) {
    event.stopPropagation();
    const atividadesAtualizadas = this.atividades().map((a) =>
      a.id === atividade.id ? { ...a, concluida: !a.concluida } : a,
    );
    this.atividades.set(atividadesAtualizadas);
  }

  openActionsModal(atividade: Atividade, event: Event) {
    event.stopPropagation();
    this.selectedAtividade.set(atividade);
    this.showActionsModal.set(true);
  }

  closeActionsModal() {
    this.showActionsModal.set(false);
    this.selectedAtividade.set(null);
  }

  goToDetail(id: string) {
    this.router.navigate(['/atividades', id]);
  }

  editAtividade(id: string) {
    this.closeActionsModal();
    this.router.navigate(['/atividades', id, 'edit']);
  }

  confirmDelete(id: string) {
    this.closeActionsModal();
    this.atividadeToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  deleteAtividade() {
    const id = this.atividadeToDelete();
    if (id) {
      const atividadesAtualizadas = this.atividades().filter((a) => a.id !== id);
      this.atividades.set(atividadesAtualizadas);
    }
    this.showDeleteModal.set(false);
    this.atividadeToDelete.set(null);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.atividadeToDelete.set(null);
  }

  addAtividade() {
    this.router.navigate(['/atividades/new']);
  }
}
