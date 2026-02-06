import { Routes } from '@angular/router';

export const CalendarioRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/calendario/calendario').then((m) => m.Calendario),
  },
];
