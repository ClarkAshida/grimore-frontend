import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TIPOS_ATIVIDADE, PRIORIDADES, STATUS_ATIVIDADE } from '../../models/atividade.model';

interface Disciplina {
  id: string;
  nome: string;
  cor: string;
}

@Component({
  selector: 'app-atividades-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atividades-form.html',
  styleUrls: ['./atividades-form.css'],
})
export class AtividadesForm implements OnInit {
  form: FormGroup;
  isEditMode = signal(false);
  atividadeId: string | null = null;
  selectedTipo = signal<string>('trabalho');
  lembreteIA = signal(false);

  readonly tiposAtividade = TIPOS_ATIVIDADE;
  readonly prioridades = PRIORIDADES;
  readonly statusOptions = STATUS_ATIVIDADE;

  // Mock disciplinas
  disciplinas: Disciplina[] = [
    { id: '1', nome: 'Cálculo I', cor: 'blue' },
    { id: '2', nome: 'Física III', cor: 'red' },
    { id: '3', nome: 'Programação II', cor: 'violet' },
    { id: '4', nome: 'História da Arte', cor: 'amber' },
    { id: '5', nome: 'Biologia', cor: 'emerald' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      disciplinaId: [''],
      tipo: ['trabalho', Validators.required],
      dataEntrega: [''],
      horaEntrega: [''],
      prioridade: ['media', Validators.required],
      status: ['a-fazer', Validators.required],
      lembreteIA: [false],
      anotacoes: [''],
    });
  }

  ngOnInit() {
    this.atividadeId = this.route.snapshot.paramMap.get('id');
    if (this.atividadeId) {
      this.isEditMode.set(true);
      this.loadAtividade(this.atividadeId);
    }

    // Sincronizar tipo selecionado com o form
    this.form.get('tipo')?.valueChanges.subscribe((tipo) => {
      this.selectedTipo.set(tipo);
    });

    this.form.get('lembreteIA')?.valueChanges.subscribe((value) => {
      this.lembreteIA.set(value);
    });
  }

  loadAtividade(id: string) {
    // Mock data - substituir por chamada HTTP real
    const mockAtividade = {
      titulo: 'Relatório de Física Quântica',
      descricao: 'Elaborar relatório completo sobre experimentos realizados.',
      disciplinaId: '2',
      tipo: 'trabalho',
      dataEntrega: '2024-10-05',
      horaEntrega: '23:59',
      prioridade: 'alta',
      status: 'a-fazer',
      lembreteIA: true,
      anotacoes: 'Focar na análise dos resultados experimentais.',
    };

    this.form.patchValue(mockAtividade);
    this.selectedTipo.set(mockAtividade.tipo);
    this.lembreteIA.set(mockAtividade.lembreteIA);
  }

  selectTipo(tipo: string) {
    this.selectedTipo.set(tipo);
    this.form.patchValue({ tipo });
  }

  toggleLembrete() {
    const currentValue = this.lembreteIA();
    this.lembreteIA.set(!currentValue);
    this.form.patchValue({ lembreteIA: !currentValue });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      console.log('Form data:', formData);

      // Mock - substituir por chamada HTTP real
      if (this.isEditMode()) {
        console.log('Atualizando atividade:', this.atividadeId);
      } else {
        console.log('Criando nova atividade');
      }

      this.router.navigate(['/atividades']);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  cancel() {
    this.router.navigate(['/atividades']);
  }

  getDisciplinaNome(id: string): string {
    return this.disciplinas.find((d) => d.id === id)?.nome || '';
  }
}
