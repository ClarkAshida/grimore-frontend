import { Routes } from '@angular/router';

export const AtividadesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/atividades-list/atividades-list').then((m) => m.AtividadesList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/atividades-form/atividades-form').then((m) => m.AtividadesForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/atividades-detail/atividades-detail').then((m) => m.AtividadesDetail),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/atividades-form/atividades-form').then((m) => m.AtividadesForm),
  },
];
