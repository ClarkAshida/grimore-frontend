import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evento } from '../../models/evento.model';

interface DiaCalendario {
  dia: number;
  mesAtual: boolean;
  data: Date;
  eventos: Evento[];
}

interface HorarioSemanal {
  hora: string;
  eventos: (Evento | null)[];
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  visualizacao = signal<'mes' | 'semana'>('mes');
  dataAtual = signal(new Date());
  disciplinasSelecionadas = signal<Set<string>>(new Set(['all']));

  // Mock de disciplinas
  disciplinas = [
    { id: '1', nome: 'Cálculo I', cor: 'blue' },
    { id: '2', nome: 'História da Arte', cor: 'amber' },
    { id: '3', nome: 'Física Geral', cor: 'violet' },
    { id: '4', nome: 'Algoritmos', cor: 'emerald' },
  ];

  // Mock de eventos
  eventos = signal<Evento[]>([
    {
      id: '1',
      titulo: 'Cálculo I',
      disciplinaId: '1',
      disciplinaNome: 'Cálculo I',
      disciplinaCor: 'blue',
      tipo: 'aula',
      dataInicio: new Date(2023, 9, 2),
      dataFim: new Date(2023, 9, 2),
      horaInicio: '08:00',
      horaFim: '10:00',
      sala: 'Sala 302',
      recorrente: true,
      recorrenciaDias: ['seg', 'qua', 'sex'],
    },
    {
      id: '2',
      titulo: 'História da Arte',
      disciplinaId: '2',
      disciplinaNome: 'História da Arte',
      disciplinaCor: 'amber',
      tipo: 'aula',
      dataInicio: new Date(2023, 9, 3),
      dataFim: new Date(2023, 9, 3),
      horaInicio: '10:00',
      horaFim: '12:00',
      sala: 'Aud. B',
      recorrente: true,
      recorrenciaDias: ['ter', 'qui'],
    },
    {
      id: '3',
      titulo: 'Algoritmos',
      disciplinaId: '4',
      disciplinaNome: 'Algoritmos',
      disciplinaCor: 'emerald',
      tipo: 'aula',
      dataInicio: new Date(2023, 9, 2),
      dataFim: new Date(2023, 9, 2),
      horaInicio: '14:00',
      horaFim: '16:00',
      sala: 'Lab. 4',
      recorrente: true,
      recorrenciaDias: ['seg', 'qua', 'sex'],
    },
    {
      id: '4',
      titulo: 'ENTREGA Projeto Final',
      disciplinaId: '4',
      disciplinaNome: 'Algoritmos',
      disciplinaCor: 'emerald',
      tipo: 'entrega',
      dataInicio: new Date(2023, 9, 5),
      dataFim: new Date(2023, 9, 5),
      horaInicio: '14:00',
      horaFim: '14:00',
      descricao: 'até às 23:59',
    },
    {
      id: '5',
      titulo: 'Física Geral',
      disciplinaId: '3',
      disciplinaNome: 'Física Geral',
      disciplinaCor: 'violet',
      tipo: 'aula',
      dataInicio: new Date(2023, 9, 4),
      dataFim: new Date(2023, 9, 4),
      horaInicio: '16:00',
      horaFim: '18:00',
      sala: 'Lab. Físico',
      recorrente: true,
      recorrenciaDias: ['qua'],
    },
    {
      id: '6',
      titulo: 'Prova 1: Cálculo',
      disciplinaId: '1',
      disciplinaNome: 'Cálculo I',
      disciplinaCor: 'blue',
      tipo: 'prova',
      dataInicio: new Date(2023, 9, 11),
      dataFim: new Date(2023, 9, 11),
      horaInicio: '08:00',
      horaFim: '10:00',
      sala: 'Sala 302',
    },
  ]);

  mesNome = computed(() => {
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return meses[this.dataAtual().getMonth()];
  });

  anoAtual = computed(() => this.dataAtual().getFullYear());

  diasDoMes = computed(() => {
    const data = this.dataAtual();
    const ano = data.getFullYear();
    const mes = data.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();

    const dias: DiaCalendario[] = [];

    // Dias do mês anterior
    const mesAnterior = new Date(ano, mes, 0);
    const diasMesAnterior = mesAnterior.getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      const dia = diasMesAnterior - i;
      const dataCompleta = new Date(ano, mes - 1, dia);
      dias.push({
        dia,
        mesAtual: false,
        data: dataCompleta,
        eventos: this.getEventosDoDia(dataCompleta),
      });
    }

    // Dias do mês atual
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataCompleta = new Date(ano, mes, dia);
      dias.push({
        dia,
        mesAtual: true,
        data: dataCompleta,
        eventos: this.getEventosDoDia(dataCompleta),
      });
    }

    // Dias do próximo mês para completar a grade
    const diasRestantes = 42 - dias.length; // 6 semanas * 7 dias
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const dataCompleta = new Date(ano, mes + 1, dia);
      dias.push({
        dia,
        mesAtual: false,
        data: dataCompleta,
        eventos: this.getEventosDoDia(dataCompleta),
      });
    }

    return dias;
  });

  semanaAtual = computed(() => {
    const data = this.dataAtual();
    const diaSemana = data.getDay();
    const inicioDaSemana = new Date(data);
    inicioDaSemana.setDate(data.getDate() - diaSemana);

    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioDaSemana);
      dia.setDate(inicioDaSemana.getDate() + i);
      dias.push({
        data: dia,
        dia: dia.getDate(),
        diaSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][i],
        eventos: this.getEventosDoDia(dia),
      });
    }

    return dias;
  });

  horariosSemanais = computed(() => {
    const horarios: HorarioSemanal[] = [];
    const horaInicio = 7;
    const horaFim = 19;

    for (let hora = horaInicio; hora <= horaFim; hora++) {
      const horaStr = `${hora.toString().padStart(2, '0')}:00`;
      const eventosNaHora = this.semanaAtual().map(
        (dia) => dia.eventos.find((e) => e.horaInicio === horaStr) || null,
      );

      horarios.push({
        hora: horaStr,
        eventos: eventosNaHora,
      });
    }

    return horarios;
  });

  periodoSemana = computed(() => {
    const semana = this.semanaAtual();
    if (semana.length === 0) return '';

    const primeiro = semana[0].dia;
    const ultimo = semana[6].dia;
    const mes = this.mesNome();
    const ano = this.anoAtual();

    return `${primeiro} - ${ultimo} ${mes} ${ano}`;
  });

  ngOnInit() {
    // Gerar eventos recorrentes para o mês atual
    this.gerarEventosRecorrentes();
  }

  gerarEventosRecorrentes() {
    const eventosRecorrentes = this.eventos().filter((e) => e.recorrente);
    const novosEventos: Evento[] = [...this.eventos()];

    const data = this.dataAtual();
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    eventosRecorrentes.forEach((evento) => {
      if (!evento.recorrenciaDias) return;

      const diasSemanaMap: Record<string, number> = {
        seg: 1,
        ter: 2,
        qua: 3,
        qui: 4,
        sex: 5,
        sab: 6,
      };

      for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
        const diaSemana = d.getDay();
        const diaNome = Object.keys(diasSemanaMap).find((k) => diasSemanaMap[k] === diaSemana);

        if (diaNome && evento.recorrenciaDias.includes(diaNome as any)) {
          const jaExiste = novosEventos.some(
            (e) =>
              e.disciplinaId === evento.disciplinaId &&
              e.dataInicio.getTime() === d.getTime() &&
              e.horaInicio === evento.horaInicio,
          );

          if (!jaExiste && d.getTime() !== evento.dataInicio.getTime()) {
            novosEventos.push({
              ...evento,
              id: `${evento.id}-${d.getTime()}`,
              dataInicio: new Date(d),
              dataFim: new Date(d),
            });
          }
        }
      }
    });

    this.eventos.set(novosEventos);
  }

  getEventosDoDia(data: Date): Evento[] {
    const dataStr = data.toDateString();
    return this.eventos().filter((e) => {
      const eventoDataStr = e.dataInicio.toDateString();
      const disciplinaSelecionada =
        this.disciplinasSelecionadas().has('all') ||
        this.disciplinasSelecionadas().has(e.disciplinaId || '');
      return eventoDataStr === dataStr && disciplinaSelecionada;
    });
  }

  toggleVisualizacao(tipo: 'mes' | 'semana') {
    this.visualizacao.set(tipo);
  }

  mesAnterior() {
    const data = new Date(this.dataAtual());
    data.setMonth(data.getMonth() - 1);
    this.dataAtual.set(data);
    this.gerarEventosRecorrentes();
  }

  proximoMes() {
    const data = new Date(this.dataAtual());
    data.setMonth(data.getMonth() + 1);
    this.dataAtual.set(data);
    this.gerarEventosRecorrentes();
  }

  semanaAnterior() {
    const data = new Date(this.dataAtual());
    data.setDate(data.getDate() - 7);
    this.dataAtual.set(data);
  }

  proximaSemana() {
    const data = new Date(this.dataAtual());
    data.setDate(data.getDate() + 7);
    this.dataAtual.set(data);
  }

  irParaHoje() {
    this.dataAtual.set(new Date());
    this.gerarEventosRecorrentes();
  }

  toggleDisciplina(id: string) {
    const selecionadas = new Set(this.disciplinasSelecionadas());

    if (id === 'all') {
      selecionadas.clear();
      selecionadas.add('all');
    } else {
      selecionadas.delete('all');
      if (selecionadas.has(id)) {
        selecionadas.delete(id);
      } else {
        selecionadas.add(id);
      }

      if (selecionadas.size === 0) {
        selecionadas.add('all');
      }
    }

    this.disciplinasSelecionadas.set(selecionadas);
  }

  isDisciplinaSelecionada(id: string): boolean {
    return this.disciplinasSelecionadas().has(id) || this.disciplinasSelecionadas().has('all');
  }

  getCorClass(cor: string): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      emerald: 'bg-emerald-500',
      violet: 'bg-violet-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
    };
    return colorMap[cor] || 'bg-blue-500';
  }

  getCorBorderClass(cor: string): string {
    const colorMap: Record<string, string> = {
      blue: 'border-blue-500',
      amber: 'border-amber-500',
      emerald: 'border-emerald-500',
      violet: 'border-violet-500',
      red: 'border-red-500',
      purple: 'border-purple-500',
    };
    return colorMap[cor] || 'border-blue-500';
  }

  getCorBgClass(cor: string): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    };
    return colorMap[cor] || 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
  }

  getTipoIcon(tipo: string): string {
    const iconMap: Record<string, string> = {
      aula: 'school',
      prova: 'quiz',
      entrega: 'assignment_turned_in',
      outro: 'event',
    };
    return iconMap[tipo] || 'event';
  }

  isHoje(data: Date): boolean {
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
  }
}
