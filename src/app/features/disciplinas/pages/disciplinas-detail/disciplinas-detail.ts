import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Disciplina } from '../../models/disciplina.model';

@Component({
  selector: 'app-disciplinas-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './disciplinas-detail.html',
  styleUrl: './disciplinas-detail.css',
})
export class DisciplinasDetail implements OnInit {
  disciplinaId: string | null = null;
  disciplina = signal<Disciplina | null>(null);
  showDeleteModal = signal(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.disciplinaId = this.route.snapshot.paramMap.get('id');
    this.loadDisciplina();
  }

  loadDisciplina() {
    // TODO: Load from service
    // Simulate loading
    const mockData: Disciplina = {
      id: this.disciplinaId || '1',
      codigo: 'MAT001',
      nome: 'Cálculo Diferencial e Integral I',
      professor: 'Prof. Ana Santos',
      cargaHoraria: 90,
      cor: 'amber',
      frequencia: 65,
      faltas: 12,
      status: 'ativa',
      horarios: [
        { diaSemana: 'seg', turno: 'manha', horaInicio: '08:00', horaFim: '10:00' },
        { diaSemana: 'qua', turno: 'manha', horaInicio: '08:00', horaFim: '10:00' },
        { diaSemana: 'sex', turno: 'tarde', horaInicio: '14:00', horaFim: '16:00' },
      ],
    };

    this.disciplina.set(mockData);
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

  getDiaNome(dia: string): string {
    const dias: Record<string, string> = {
      seg: 'Segunda',
      ter: 'Terça',
      qua: 'Quarta',
      qui: 'Quinta',
      sex: 'Sexta',
      sab: 'Sábado',
    };
    return dias[dia] || dia;
  }

  getTurnoNome(turno: string): string {
    const turnos: Record<string, string> = {
      manha: 'Manhã',
      tarde: 'Tarde',
      noite: 'Noite',
    };
    return turnos[turno] || turno;
  }

  confirmDelete() {
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
  }

  deleteDisciplina() {
    // TODO: Call service to delete
    console.log('Deleting disciplina:', this.disciplinaId);
    this.showDeleteModal.set(false);
    this.router.navigate(['/disciplinas']);
  }

  editDisciplina() {
    this.router.navigate(['/disciplinas', this.disciplinaId, 'edit']);
  }
}
