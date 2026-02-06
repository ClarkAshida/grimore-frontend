import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CORES_DISCIPLINA, DIAS_SEMANA, HorarioDisciplina } from '../../models/disciplina.model';

@Component({
  selector: 'app-disciplinas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './disciplinas-form.html',
  styleUrl: './disciplinas-form.css',
})
export class DisciplinasForm implements OnInit {
  form!: FormGroup;
  isEditMode = signal(false);
  disciplinaId: string | null = null;
  cores = CORES_DISCIPLINA;
  diasSemana = DIAS_SEMANA;
  selectedDias = signal<Set<string>>(new Set());

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.disciplinaId = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!this.disciplinaId);

    this.form = this.fb.group({
      nome: ['', Validators.required],
      codigo: [''],
      professor: [''],
      cargaHoraria: [60, [Validators.required, Validators.min(1)]],
      cor: ['blue', Validators.required],
      horarios: this.fb.array([]),
    });

    if (this.isEditMode()) {
      this.loadDisciplina();
    } else {
      // Add one default horario slot
      this.addHorario();
    }
  }

  get horarios(): FormArray {
    return this.form.get('horarios') as FormArray;
  }

  loadDisciplina() {
    // TODO: Load from service
    // For now, simulate loading
    const mockData = {
      nome: 'Cálculo Diferencial e Integral I',
      codigo: 'MAT001',
      professor: 'Prof. Ana Santos',
      cargaHoraria: 90,
      cor: 'amber',
      horarios: [
        { diaSemana: 'seg', turno: 'manha', horaInicio: '08:00', horaFim: '10:00' },
        { diaSemana: 'qua', turno: 'manha', horaInicio: '08:00', horaFim: '10:00' },
      ],
    };

    this.form.patchValue({
      nome: mockData.nome,
      codigo: mockData.codigo,
      professor: mockData.professor,
      cargaHoraria: mockData.cargaHoraria,
      cor: mockData.cor,
    });

    mockData.horarios.forEach((h) => {
      this.addHorario(h as HorarioDisciplina);
      this.selectedDias().add(h.diaSemana);
    });
  }

  createHorarioGroup(horario?: Partial<HorarioDisciplina>): FormGroup {
    return this.fb.group({
      diaSemana: [horario?.diaSemana || '', Validators.required],
      turno: [horario?.turno || 'manha', Validators.required],
      horaInicio: [horario?.horaInicio || '08:00', Validators.required],
      horaFim: [horario?.horaFim || '10:00', Validators.required],
    });
  }

  addHorario(horario?: Partial<HorarioDisciplina>) {
    this.horarios.push(this.createHorarioGroup(horario));
  }

  removeHorario(index: number) {
    const horario = this.horarios.at(index).value;
    this.selectedDias().delete(horario.diaSemana);
    this.horarios.removeAt(index);
  }

  toggleDia(dia: string) {
    const dias = this.selectedDias();
    if (dias.has(dia)) {
      // Remove all horarios for this dia
      const horariosToRemove: number[] = [];
      this.horarios.controls.forEach((control, index) => {
        if (control.value.diaSemana === dia) {
          horariosToRemove.push(index);
        }
      });
      horariosToRemove.reverse().forEach((index) => this.horarios.removeAt(index));
      dias.delete(dia);
    } else {
      dias.add(dia);
      // Add a horario for this dia
      this.addHorario({ diaSemana: dia as any });
    }
    this.selectedDias.set(new Set(dias));
  }

  isDiaSelected(dia: string): boolean {
    return this.selectedDias().has(dia);
  }

  getHorariosForDia(dia: string): FormGroup[] {
    return this.horarios.controls.filter(
      (control) => control.value.diaSemana === dia,
    ) as FormGroup[];
  }

  addHorarioForDia(dia: string) {
    this.addHorario({ diaSemana: dia as any });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      console.log('Form submitted:', formValue);

      // TODO: Call service to save

      // Navigate back to list
      this.router.navigate(['/disciplinas']);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
      this.horarios.controls.forEach((control) => {
        Object.keys((control as FormGroup).controls).forEach((key) => {
          control.get(key)?.markAsTouched();
        });
      });
    }
  }

  cancel() {
    this.router.navigate(['/disciplinas']);
  }
}
