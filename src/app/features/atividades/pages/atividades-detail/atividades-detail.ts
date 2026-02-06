import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Atividade, TIPOS_ATIVIDADE, PRIORIDADES } from '../../models/atividade.model';

@Component({
  selector: 'app-atividades-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atividades-detail.html',
  styleUrls: ['./atividades-detail.css'],
})
export class AtividadesDetail implements OnInit {
  atividade = signal<Atividade | null>(null);
  showDeleteModal = signal(false);
  concluida = signal(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAtividade(id);
    }
  }

  loadAtividade(id: string) {
    // Mock data - substituir por chamada HTTP real
    const mockAtividade: Atividade = {
      id: '1',
      titulo: 'Resumo do Capítulo 4 - Renascimento',
      descricao: 'Focar nos principais artistas e suas obras mais influentes.',
      disciplinaId: '1',
      disciplinaNome: 'História da Arte',
      disciplinaCor: 'amber',
      tipo: 'trabalho',
      dataEntrega: new Date(2024, 9, 24), // 24 outubro
      horaEntrega: '14:20',
      prioridade: 'alta',
      status: 'a-fazer',
      lembreteIA: true,
      anotacoes: `É necessário fazer a leitura completa do capítulo. O resumo deve conter no máximo 3 páginas e abordar os seguintes tópicos:

• Contexto histórico do Renascimento na Itália.
• Principais características da pintura renascentista (perspectiva, luz e sombra).
• Biografia resumida de Leonardo da Vinci e Michelangelo.
• Análise breve de "A Escola de Atenas".

* Lembre-se de adicionar as referências bibliográficas no formato ABNT.`,
      concluida: false,
      createdAt: new Date(2024, 9, 10),
      updatedAt: new Date(2024, 9, 21),
    };

    this.atividade.set(mockAtividade);
    this.concluida.set(mockAtividade.concluida);
  }

  getCorClass(cor: string): string {
    const cores: Record<string, string> = {
      blue: 'from-blue-500 to-indigo-500',
      red: 'from-red-500 to-pink-500',
      amber: 'from-amber-500 to-orange-500',
      emerald: 'from-emerald-500 to-teal-500',
      indigo: 'from-indigo-500 to-purple-500',
      violet: 'from-violet-500 to-purple-500',
      pink: 'from-pink-500 to-rose-500',
    };
    return cores[cor] || 'from-slate-500 to-slate-600';
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

  getPrioridadeInfo(prioridade: string) {
    return PRIORIDADES.find((p) => p.value === prioridade);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  formatDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  toggleConcluida() {
    const atividade = this.atividade();
    if (atividade) {
      const novaConcluida = !this.concluida();
      this.concluida.set(novaConcluida);
      this.atividade.set({ ...atividade, concluida: novaConcluida });
    }
  }

  goBack() {
    this.router.navigate(['/atividades']);
  }

  editAtividade() {
    const id = this.atividade()?.id;
    if (id) {
      this.router.navigate(['/atividades', id, 'edit']);
    }
  }

  confirmDelete() {
    this.showDeleteModal.set(true);
  }

  deleteAtividade() {
    // Mock - substituir por chamada HTTP real
    console.log('Deletando atividade:', this.atividade()?.id);
    this.showDeleteModal.set(false);
    this.router.navigate(['/atividades']);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
  }

  shareAtividade() {
    // Implementar compartilhamento
    console.log('Compartilhar atividade');
  }
}
