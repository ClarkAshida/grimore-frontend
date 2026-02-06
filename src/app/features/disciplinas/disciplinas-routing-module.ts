import { Routes } from '@angular/router';

export const DisciplinasRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/disciplinas-list/disciplinas-list').then((m) => m.DisciplinasList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/disciplinas-form/disciplinas-form').then((m) => m.DisciplinasForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/disciplinas-detail/disciplinas-detail').then((m) => m.DisciplinasDetail),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/disciplinas-form/disciplinas-form').then((m) => m.DisciplinasForm),
  },
];
