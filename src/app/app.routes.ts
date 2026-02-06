import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register').then((m) => m.Register),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/pages/forgot-password/forgot-password').then(
            (m) => m.ForgotPassword,
          ),
      },
      {
        path: 'verify-code',
        loadComponent: () =>
          import('./features/auth/pages/verify-code/verify-code').then((m) => m.VerifyCode),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/pages/reset-password/reset-password').then(
            (m) => m.ResetPassword,
          ),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayout,
    // canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/home/home').then((m) => m.Home),
      },
      {
        path: 'disciplinas',
        loadChildren: () =>
          import('./features/disciplinas/disciplinas-routing-module').then(
            (m) => m.DisciplinasRoutes,
          ),
      },
      {
        path: 'calendario',
        loadChildren: () =>
          import('./features/calendario/calendario-routing-module').then((m) => m.CalendarioRoutes),
      },
      {
        path: 'atividades',
        loadChildren: () =>
          import('./features/atividades/atividades-routing-module').then((m) => m.AtividadesRoutes),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/perfil/pages/perfil/perfil').then((m) => m.Perfil),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
