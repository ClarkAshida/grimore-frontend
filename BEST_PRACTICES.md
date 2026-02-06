# Best Practices - Grimore Frontend (Angular 21)

## 📁 Estrutura de Pastas e Organização

### 1. Separação por Camadas

```
src/app/
├── core/           # Serviços singleton, guards, interceptors (importado UMA vez)
├── features/       # Módulos de funcionalidades (lazy loading)
├── shared/         # Componentes, pipes, diretivas reutilizáveis
└── layouts/        # Estruturas de página (auth, main)
```

#### **Core Module**

- Importar apenas uma vez no `app.config.ts` ou `main.ts`
- Contém serviços singleton (auth, http, storage)
- Guards e Interceptors globais
- **Nunca** importe o CoreModule em feature modules

#### **Shared Module**

- Componentes reutilizáveis (botões, modais, cards)
- Pipes e Diretivas customizadas
- Pode ser importado em qualquer feature module
- Exporte tudo que será usado externamente

#### **Features Module**

- Um módulo por funcionalidade (atividades, disciplinas, auth)
- Sempre com lazy loading
- Estrutura interna consistente:
  ```
  feature/
  ├── models/       # Interfaces e types
  ├── pages/        # Componentes de página
  ├── services/     # Serviços específicos da feature
  ├── components/   # Componentes internos (opcional)
  ├── feature.module.ts
  └── feature-routing.module.ts
  ```

---

## 🎯 Nomenclatura e Convenções

### Arquivos e Pastas

```typescript
// ✅ CORRETO
auth.guard.ts;
auth.service.ts;
atividade.model.ts;
atividades - list.component.ts;
uppercase.pipe.ts;

// ❌ EVITAR
AuthGuard.ts;
auth - service.ts;
atividadeModel.ts;
AtividadesListComponent.ts;
```

### Regras de Nomenclatura

| Tipo         | Padrão                | Exemplo                        |
| ------------ | --------------------- | ------------------------------ |
| Componentes  | `nome.component.ts`   | `atividades-list.component.ts` |
| Serviços     | `nome.service.ts`     | `atividades.service.ts`        |
| Guards       | `nome.guard.ts`       | `auth.guard.ts`                |
| Interceptors | `nome.interceptor.ts` | `auth.interceptor.ts`          |
| Pipes        | `nome.pipe.ts`        | `currency-brl.pipe.ts`         |
| Diretivas    | `nome.directive.ts`   | `highlight.directive.ts`       |
| Modelos      | `nome.model.ts`       | `atividade.model.ts`           |
| Interfaces   | `nome.interface.ts`   | `api-response.interface.ts`    |
| Enums        | `nome.enum.ts`        | `status.enum.ts`               |

### Classes e Interfaces

```typescript
// ✅ CORRETO - PascalCase
export class AtividadesService {}
export interface Atividade {}
export enum StatusAtividade {}

// ❌ EVITAR
export class atividadesService {}
export interface atividade {}
```

### Variáveis e Funções

```typescript
// ✅ CORRETO - camelCase
const atividadeAtual: Atividade;
function calcularNota(): number {}

// ❌ EVITAR
const AtividadeAtual: Atividade;
function CalcularNota(): number {}
```

### Constantes

```typescript
// ✅ CORRETO - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000';
const MAX_RETRIES = 3;

// ❌ EVITAR
const apiBaseUrl = 'http://localhost:3000';
```

---

## 🔧 Componentes

### 1. Standalone Components (Angular 21)

```typescript
// ✅ CORRETO - Componente Standalone
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-atividades-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './atividades-list.component.html',
  styleUrls: ['./atividades-list.component.css'],
})
export class AtividadesListComponent {
  // Lógica do componente
}
```

### 2. Change Detection Strategy

```typescript
// ✅ CORRETO - Use OnPush sempre que possível
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-atividades-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class AtividadesCardComponent {}
```

**Benefícios:**

- Melhor performance
- Menos verificações desnecessárias
- Código mais previsível

### 3. Lifecycle Hooks

```typescript
// ✅ CORRETO - Ordem recomendada
export class AtividadesListComponent implements OnInit, OnDestroy {
  // 1. Propriedades públicas
  atividades: Atividade[] = [];

  // 2. ViewChild/ContentChild
  @ViewChild('modal') modal!: ElementRef;

  // 3. Input/Output
  @Input() titulo: string = '';
  @Output() atividadeSelecionada = new EventEmitter<Atividade>();

  // 4. Propriedades privadas
  private destroy$ = new Subject<void>();

  // 5. Constructor (injeção de dependências)
  constructor(
    private atividadesService: AtividadesService,
    private router: Router,
  ) {}

  // 6. Lifecycle hooks (ordem de execução)
  ngOnInit(): void {
    this.carregarAtividades();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 7. Métodos públicos
  selecionarAtividade(atividade: Atividade): void {
    this.atividadeSelecionada.emit(atividade);
  }

  // 8. Métodos privados
  private carregarAtividades(): void {
    this.atividadesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((atividades) => (this.atividades = atividades));
  }
}
```

### 4. Component Size

```typescript
// ✅ CORRETO - Componente pequeno e focado
export class AtividadeCardComponent {
  @Input() atividade!: Atividade;
  @Output() editar = new EventEmitter<Atividade>();
  @Output() deletar = new EventEmitter<number>();
}

// ❌ EVITAR - Componente fazendo múltiplas responsabilidades
export class AtividadeComponent {
  // Lista, formulário, edição, exclusão tudo no mesmo componente
  // Divida em componentes menores!
}
```

**Regra de ouro:** Se um componente tem mais de 300 linhas, considere dividir.

---

## 🎨 Templates

### 1. Estrutura e Formatação

```html
<!-- ✅ CORRETO - Indentação e organização clara -->
<div class="atividades-container">
  <header class="atividades-header">
    <h1>{{ titulo }}</h1>
    <button (click)="adicionar()">Adicionar</button>
  </header>

  <div class="atividades-list">
    <app-atividade-card
      *ngFor="let atividade of atividades; trackBy: trackByAtividade"
      [atividade]="atividade"
      (editar)="editarAtividade($event)"
      (deletar)="deletarAtividade($event)"
    >
    </app-atividade-card>
  </div>
</div>

<!-- ❌ EVITAR - Template confuso e sem organização -->
<div>
  <h1>{{titulo}}</h1>
  <button (click)="adicionar()">Adicionar</button>
  <div *ngFor="let atividade of atividades">
    <app-atividade-card [atividade]="atividade"></app-atividade-card>
  </div>
</div>
```

### 2. TrackBy Functions

```typescript
// ✅ CORRETO - Use trackBy em *ngFor
trackByAtividade(index: number, atividade: Atividade): number {
  return atividade.id;
}
```

```html
<!-- ✅ CORRETO -->
<div *ngFor="let atividade of atividades; trackBy: trackByAtividade">{{ atividade.titulo }}</div>

<!-- ❌ EVITAR - Performance ruim -->
<div *ngFor="let atividade of atividades">{{ atividade.titulo }}</div>
```

### 3. Async Pipe

```typescript
// ✅ CORRETO - Use async pipe
atividades$ = this.atividadesService.getAll();
```

```html
<!-- ✅ CORRETO - Gerenciamento automático de subscription -->
<div *ngIf="atividades$ | async as atividades">
  <app-atividade-card
    *ngFor="let atividade of atividades; trackBy: trackByAtividade"
    [atividade]="atividade"
  >
  </app-atividade-card>
</div>

<!-- ❌ EVITAR - Subscription manual -->
<div>
  <app-atividade-card *ngFor="let atividade of atividades" [atividade]="atividade">
  </app-atividade-card>
</div>
```

### 4. Lógica no Template

```html
<!-- ❌ EVITAR - Lógica complexa no template -->
<div
  *ngIf="(atividade.status === 'pendente' && atividade.prioridade > 3) || (atividade.status === 'em_andamento' && dataAtual > atividade.prazo)"
>
  Atenção necessária
</div>

<!-- ✅ CORRETO - Use getters ou métodos no componente -->
<div *ngIf="necessitaAtencao(atividade)">Atenção necessária</div>
```

```typescript
// No componente
necessitaAtencao(atividade: Atividade): boolean {
  return (atividade.status === 'pendente' && atividade.prioridade > 3) ||
         (atividade.status === 'em_andamento' && this.dataAtual > atividade.prazo);
}
```

### 5. Eventos

```html
<!-- ✅ CORRETO - Nomes descritivos -->
<button (click)="salvarAtividade()">Salvar</button>
<form (ngSubmit)="onSubmit()">...</form>
<input (keyup.enter)="buscar()" />

<!-- ❌ EVITAR - Nomes genéricos -->
<button (click)="onClick()">Salvar</button>
<button (click)="action()">Salvar</button>
```

---

## 🔄 Serviços

### 1. Estrutura de Service

```typescript
// ✅ CORRETO
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Atividade } from '../models/atividade.model';

@Injectable({
  providedIn: 'root', // Singleton global
})
export class AtividadesService {
  private readonly apiUrl = `${environment.apiUrl}/atividades`;
  private atividadesSubject = new BehaviorSubject<Atividade[]>([]);

  // Expor como Observable (read-only)
  public atividades$ = this.atividadesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(this.apiUrl).pipe(
      map((atividades) => this.ordenarPorData(atividades)),
      catchError(this.handleError),
    );
  }

  getById(id: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.apiUrl}/${id}`);
  }

  create(atividade: Atividade): Observable<Atividade> {
    return this.http.post<Atividade>(this.apiUrl, atividade);
  }

  update(id: number, atividade: Atividade): Observable<Atividade> {
    return this.http.put<Atividade>(`${this.apiUrl}/${id}`, atividade);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private ordenarPorData(atividades: Atividade[]): Atividade[] {
    return atividades.sort(
      (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erro no serviço:', error);
    throw error;
  }
}
```

### 2. Evitar Lógica de Negócio nos Componentes

```typescript
// ❌ EVITAR - Lógica no componente
export class AtividadesListComponent {
  salvar(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post('http://localhost:3000/api/atividades', this.atividade, { headers })
      .subscribe(/* ... */);
  }
}

// ✅ CORRETO - Lógica no serviço
export class AtividadesListComponent {
  constructor(private atividadesService: AtividadesService) {}

  salvar(): void {
    this.atividadesService.create(this.atividade).subscribe(/* ... */);
  }
}
```

### 3. State Management Simples

```typescript
// ✅ CORRETO - BehaviorSubject para estado simples
@Injectable({ providedIn: 'root' })
export class AtividadesStateService {
  private atividadesSubject = new BehaviorSubject<Atividade[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public atividades$ = this.atividadesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  setAtividades(atividades: Atividade[]): void {
    this.atividadesSubject.next(atividades);
  }

  addAtividade(atividade: Atividade): void {
    const current = this.atividadesSubject.value;
    this.atividadesSubject.next([...current, atividade]);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}
```

---

## 📝 Formulários

### 1. Reactive Forms (Recomendado)

```typescript
// ✅ CORRETO - Reactive Forms
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-atividade-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atividade-form.component.html',
})
export class AtividadeFormComponent implements OnInit {
  atividadeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.atividadeForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      prazo: ['', Validators.required],
      disciplinaId: ['', Validators.required],
      prioridade: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  onSubmit(): void {
    if (this.atividadeForm.valid) {
      const atividade = this.atividadeForm.value;
      // Processar...
    } else {
      this.markFormGroupTouched(this.atividadeForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar acesso no template
  get titulo() {
    return this.atividadeForm.get('titulo');
  }
  get prazo() {
    return this.atividadeForm.get('prazo');
  }
}
```

```html
<!-- Template -->
<form [formGroup]="atividadeForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="titulo">Título</label>
    <input
      id="titulo"
      type="text"
      formControlName="titulo"
      [class.invalid]="titulo?.invalid && titulo?.touched"
    />

    <div *ngIf="titulo?.invalid && titulo?.touched" class="error">
      <span *ngIf="titulo?.errors?.['required']">Título é obrigatório</span>
      <span *ngIf="titulo?.errors?.['minlength']">Mínimo 3 caracteres</span>
    </div>
  </div>

  <button type="submit" [disabled]="atividadeForm.invalid">Salvar</button>
</form>
```

### 2. Validadores Customizados

```typescript
// validators/prazo-futuro.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function prazoFuturoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const prazo = new Date(control.value);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return prazo < hoje ? { prazoPassado: true } : null;
  };
}

// Uso
this.atividadeForm = this.fb.group({
  prazo: ['', [Validators.required, prazoFuturoValidator()]],
});
```

### 3. Form Utilities

```typescript
// shared/utils/form.utils.ts
export class FormUtils {
  static markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  static getFormValidationErrors(form: FormGroup): string[] {
    const errors: string[] = [];

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control?.errors) {
        Object.keys(control.errors).forEach((errorKey) => {
          errors.push(`${key}: ${errorKey}`);
        });
      }
    });

    return errors;
  }
}
```

---

## 🛡️ RxJS e Observables

### 1. Subscription Management

```typescript
// ✅ CORRETO - Método 1: takeUntil
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AtividadesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.atividadesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((atividades) => (this.atividades = atividades));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ CORRETO - Método 2: Async Pipe (preferencial)
export class AtividadesListComponent {
  atividades$ = this.atividadesService.getAll();
}
```

```html
<div *ngIf="atividades$ | async as atividades">
  <!-- Template -->
</div>
```

```typescript
// ❌ EVITAR - Subscription sem cleanup
ngOnInit(): void {
  this.atividadesService.getAll()
    .subscribe(atividades => this.atividades = atividades);
  // Memory leak!
}
```

### 2. Operadores Úteis

```typescript
import { debounceTime, distinctUntilChanged, switchMap, catchError, retry } from 'rxjs/operators';

// Busca com debounce
searchControl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) => this.atividadesService.search(term)),
  )
  .subscribe((results) => (this.resultados = results));

// Retry em caso de erro
this.http
  .get(url)
  .pipe(
    retry(3),
    catchError((error) => {
      console.error(error);
      return of([]);
    }),
  )
  .subscribe();

// Combinar múltiplos observables
combineLatest([this.atividadesService.getAll(), this.disciplinasService.getAll()])
  .pipe(
    map(([atividades, disciplinas]) => ({
      atividades,
      disciplinas,
    })),
  )
  .subscribe();
```

### 3. Error Handling

```typescript
// ✅ CORRETO - Tratamento de erro consistente
@Injectable({ providedIn: 'root' })
export class AtividadesService {
  getAll(): Observable<Atividade[]> {
    return this.http
      .get<Atividade[]>(this.apiUrl)
      .pipe(retry(2), catchError(this.handleError<Atividade[]>('getAll', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Log para serviço de analytics/monitoramento
      this.logError(error);

      // Retornar valor padrão
      return of(result as T);
    };
  }

  private logError(error: any): void {
    // Implementar serviço de log
  }
}
```

---

## 🔐 Guards e Interceptors

### 1. Auth Guard

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirecionar para login com URL de retorno
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
```

### 2. Auth Interceptor

```typescript
// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
```

### 3. Error Interceptor

```typescript
// core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Usuário não autenticado
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        // Sem permissão
        router.navigate(['/unauthorized']);
      } else if (error.status === 500) {
        // Erro no servidor
        console.error('Erro no servidor:', error);
      }

      return throwError(() => error);
    }),
  );
};
```

### 4. Configuração no app.config.ts

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
```

---

## 🎨 Estilos e Tailwind CSS

````markdown
## 🎨 Estilos com Tailwind CSS

### 1. Instalação e Configuração

```bash
# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```
````

### 2. Configuração do Tailwind

**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5', // Cor principal
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },
        secondary: {
          50: '#fce4ec',
          100: '#f8bbd0',
          200: '#f48fb1',
          300: '#f06292',
          400: '#ec407a',
          500: '#ff4081', // Cor secundária
          600: '#e91e63',
          700: '#d81b60',
          800: '#c2185b',
          900: '#880e4f',
        },
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.23)',
        modal: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

**styles.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }

  h1 {
    @apply text-3xl font-bold text-gray-900;
  }

  h2 {
    @apply text-2xl font-semibold text-gray-800;
  }

  h3 {
    @apply text-xl font-semibold text-gray-700;
  }
}

/* Custom component classes */
@layer components {
  /* Buttons */
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-300 
           focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 
           focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300 
           focus:ring-gray-400;
  }

  .btn-danger {
    @apply bg-red-500 text-white hover:bg-red-600 
           focus:ring-red-500;
  }

  .btn-success {
    @apply bg-green-500 text-white hover:bg-green-600 
           focus:ring-green-500;
  }

  .btn-outline {
    @apply border-2 border-primary-500 text-primary-500 
           hover:bg-primary-50 focus:ring-primary-500;
  }

  /* Cards */
  .card {
    @apply bg-white rounded-lg shadow-card p-6 
           transition-shadow duration-300 hover:shadow-card-hover;
  }

  .card-header {
    @apply flex items-center justify-between mb-4 pb-4 border-b border-gray-200;
  }

  .card-title {
    @apply text-xl font-semibold text-gray-900;
  }

  .card-body {
    @apply text-gray-700;
  }

  .card-footer {
    @apply mt-4 pt-4 border-t border-gray-200 flex items-center justify-end gap-2;
  }

  /* Forms */
  .form-group {
    @apply mb-4;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-2;
  }

  .form-input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-primary-500 focus:border-transparent 
           transition-all duration-200;
  }

  .form-input-error {
    @apply border-red-500 focus:ring-red-500;
  }

  .form-error {
    @apply text-sm text-red-600 mt-1;
  }

  .form-textarea {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-primary-500 focus:border-transparent 
           min-h-[100px] resize-y;
  }

  .form-select {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-primary-500 focus:border-transparent 
           bg-white cursor-pointer;
  }

  .form-checkbox {
    @apply w-4 h-4 text-primary-500 border-gray-300 rounded 
           focus:ring-2 focus:ring-primary-500;
  }

  /* Badges */
  .badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
  }

  .badge-primary {
    @apply bg-primary-100 text-primary-800;
  }

  .badge-success {
    @apply bg-green-100 text-green-800;
  }

  .badge-warning {
    @apply bg-yellow-100 text-yellow-800;
  }

  .badge-danger {
    @apply bg-red-100 text-red-800;
  }

  .badge-info {
    @apply bg-blue-100 text-blue-800;
  }

  /* Alerts */
  .alert {
    @apply px-4 py-3 rounded-lg mb-4;
  }

  .alert-success {
    @apply bg-green-50 border border-green-200 text-green-800;
  }

  .alert-warning {
    @apply bg-yellow-50 border border-yellow-200 text-yellow-800;
  }

  .alert-error {
    @apply bg-red-50 border border-red-200 text-red-800;
  }

  .alert-info {
    @apply bg-blue-50 border border-blue-200 text-blue-800;
  }

  /* Tables */
  .table {
    @apply w-full text-left;
  }

  .table-header {
    @apply bg-gray-50 border-b border-gray-200;
  }

  .table-header-cell {
    @apply px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider;
  }

  .table-row {
    @apply border-b border-gray-200 hover:bg-gray-50 transition-colors;
  }

  .table-cell {
    @apply px-6 py-4 text-sm text-gray-900;
  }

  /* Modals */
  .modal-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 z-40 
           flex items-center justify-center p-4;
  }

  .modal-content {
    @apply bg-white rounded-xl shadow-modal max-w-lg w-full 
           max-h-[90vh] overflow-y-auto z-50;
  }

  .modal-header {
    @apply px-6 py-4 border-b border-gray-200 flex items-center justify-between;
  }

  .modal-title {
    @apply text-xl font-semibold text-gray-900;
  }

  .modal-body {
    @apply px-6 py-4;
  }

  .modal-footer {
    @apply px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2;
  }

  /* Loading Spinner */
  .spinner {
    @apply inline-block w-8 h-8 border-4 border-gray-200 
           border-t-primary-500 rounded-full animate-spin;
  }

  /* Container */
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 3. Exemplos de Uso nos Componentes

**Componente de Lista (atividades-list.component.html):**

```html
<div class="container-custom py-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900">Atividades</h1>
    <button class="btn btn-primary" (click)="adicionar()">
      <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Nova Atividade
    </button>
  </div>

  <!-- Filtros -->
  <div class="card mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="form-group mb-0">
        <label class="form-label">Buscar</label>
        <input
          type="text"
          class="form-input"
          placeholder="Buscar atividades..."
          [(ngModel)]="filtro.busca"
        />
      </div>

      <div class="form-group mb-0">
        <label class="form-label">Status</label>
        <select class="form-select" [(ngModel)]="filtro.status">
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      <div class="form-group mb-0">
        <label class="form-label">Prioridade</label>
        <select class="form-select" [(ngModel)]="filtro.prioridade">
          <option value="">Todas</option>
          <option value="1">Baixa</option>
          <option value="3">Média</option>
          <option value="5">Alta</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Lista de Atividades -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      *ngFor="let atividade of atividades; trackBy: trackByAtividade"
      class="card group cursor-pointer"
      (click)="verDetalhes(atividade)"
    >
      <!-- Header do Card -->
      <div class="card-header">
        <h3 class="card-title">{{ atividade.titulo }}</h3>
        <span
          class="badge"
          [ngClass]="{
            'badge-warning': atividade.status === 'pendente',
            'badge-info': atividade.status === 'em_andamento',
            'badge-success': atividade.status === 'concluida'
          }"
        >
          {{ atividade.status | titlecase }}
        </span>
      </div>

      <!-- Body do Card -->
      <div class="card-body">
        <p class="text-gray-600 mb-4 line-clamp-2">{{ atividade.descricao }}</p>

        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ atividade.prazo | date:'dd/MM/yyyy' }}
          </div>

          <div class="flex items-center">
            <svg
              *ngFor="let star of [1,2,3,4,5]"
              class="w-4 h-4"
              [class.text-yellow-400]="star <= atividade.prioridade"
              [class.text-gray-300]="star > atividade.prioridade"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Footer do Card -->
      <div class="card-footer">
        <button
          class="btn btn-secondary btn-sm"
          (click)="editar(atividade); $event.stopPropagation()"
        >
          Editar
        </button>
        <button
          class="btn btn-danger btn-sm"
          (click)="deletar(atividade.id!); $event.stopPropagation()"
        >
          Excluir
        </button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div *ngIf="atividades.length === 0" class="card text-center py-12">
    <svg
      class="w-24 h-24 mx-auto text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhuma atividade encontrada</h3>
    <p class="text-gray-500 mb-4">Comece criando sua primeira atividade</p>
    <button class="btn btn-primary" (click)="adicionar()">Criar Atividade</button>
  </div>
</div>
```

**Componente de Formulário (atividade-form.component.html):**

```html
<div class="container-custom py-6">
  <div class="max-w-2xl mx-auto">
    <div class="card">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          {{ isEditMode ? 'Editar Atividade' : 'Nova Atividade' }}
        </h2>
        <p class="text-gray-600">Preencha os dados da atividade</p>
      </div>

      <!-- Form -->
      <form [formGroup]="atividadeForm" (ngSubmit)="onSubmit()">
        <!-- Título -->
        <div class="form-group">
          <label for="titulo" class="form-label">
            Título <span class="text-red-500">*</span>
          </label>
          <input
            id="titulo"
            type="text"
            formControlName="titulo"
            class="form-input"
            [class.form-input-error]="titulo?.invalid && titulo?.touched"
            placeholder="Digite o título da atividade"
          />

          <div *ngIf="titulo?.invalid && titulo?.touched" class="form-error">
            <span *ngIf="titulo?.errors?.['required']"> Título é obrigatório </span>
            <span *ngIf="titulo?.errors?.['minlength']">
              Título deve ter no mínimo 3 caracteres
            </span>
          </div>
        </div>

        <!-- Descrição -->
        <div class="form-group">
          <label for="descricao" class="form-label">Descrição</label>
          <textarea
            id="descricao"
            formControlName="descricao"
            class="form-textarea"
            placeholder="Descreva a atividade..."
            rows="4"
          >
          </textarea>
        </div>

        <!-- Prazo e Disciplina (Grid) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="prazo" class="form-label">
              Prazo <span class="text-red-500">*</span>
            </label>
            <input
              id="prazo"
              type="date"
              formControlName="prazo"
              class="form-input"
              [class.form-input-error]="prazo?.invalid && prazo?.touched"
            />

            <div *ngIf="prazo?.invalid && prazo?.touched" class="form-error">
              Prazo é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="disciplina" class="form-label">
              Disciplina <span class="text-red-500">*</span>
            </label>
            <select id="disciplina" formControlName="disciplinaId" class="form-select">
              <option value="">Selecione uma disciplina</option>
              <option *ngFor="let disciplina of disciplinas" [value]="disciplina.id">
                {{ disciplina.nome }}
              </option>
            </select>
          </div>
        </div>

        <!-- Prioridade -->
        <div class="form-group">
          <label class="form-label"> Prioridade <span class="text-red-500">*</span> </label>
          <div class="flex items-center gap-4">
            <label *ngFor="let p of [1, 2, 3, 4, 5]" class="flex items-center cursor-pointer">
              <input
                type="radio"
                formControlName="prioridade"
                [value]="p"
                class="form-checkbox mr-2"
              />
              <span class="flex items-center">
                <svg
                  *ngFor="let star of [1,2,3,4,5]"
                  class="w-5 h-5"
                  [class.text-yellow-400]="star <= p"
                  [class.text-gray-300]="star > p"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </span>
            </label>
          </div>
        </div>

        <!-- Alert de Erro -->
        <div *ngIf="errorMessage" class="alert alert-error mb-4">{{ errorMessage }}</div>

        <!-- Botões -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button type="button" class="btn btn-secondary" (click)="voltar()">Cancelar</button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="atividadeForm.invalid || loading"
          >
            <span *ngIf="loading" class="spinner mr-2 w-4 h-4"></span>
            {{ isEditMode ? 'Atualizar' : 'Criar' }} Atividade
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
```

### 4. Componentes Reutilizáveis com Tailwind

**Loading Component:**

```html
<!-- shared/components/loading/loading.component.html -->
<div class="flex items-center justify-center p-8">
  <div class="spinner"></div>
  <span class="ml-3 text-gray-600">{{ message || 'Carregando...' }}</span>
</div>
```

**Modal Component:**

```html
<!-- shared/components/modal/modal.component.html -->
<div *ngIf="isOpen" class="modal-overlay" (click)="onOverlayClick()">
  <div class="modal-content" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <h3 class="modal-title">{{ title }}</h3>
      <button (click)="close()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <ng-content></ng-content>
    </div>

    <div class="modal-footer" *ngIf="showFooter">
      <button class="btn btn-secondary" (click)="close()">Cancelar</button>
      <button class="btn btn-primary" (click)="confirm()">Confirmar</button>
    </div>
  </div>
</div>
```

### 5. Utilitários Customizados

**Responsive Design:**

```html
<!-- Mobile First Approach -->
<div
  class="
  grid 
  grid-cols-1           <!-- Mobile: 1 coluna -->
  sm:grid-cols-2        <!-- Small: 2 colunas -->
  md:grid-cols-3        <!-- Medium: 3 colunas -->
  lg:grid-cols-4        <!-- Large: 4 colunas -->
  gap-4                 <!-- Gap entre items -->
"
>
  <!-- Content -->
</div>

<!-- Esconder/Mostrar por tamanho de tela -->
<div class="hidden md:block">Visível apenas em telas médias ou maiores</div>

<div class="block md:hidden">Visível apenas em mobile</div>
```

**Estados Hover e Focus:**

```html
<button
  class="
  bg-primary-500 
  hover:bg-primary-600      <!-- Hover -->
  focus:ring-2              <!-- Focus ring -->
  focus:ring-primary-500    <!-- Focus color -->
  active:bg-primary-700     <!-- Active state -->
  transition-all            <!-- Smooth transition -->
  duration-200
"
>
  Botão
</button>
```

### 6. Plugins Recomendados do Tailwind

```bash
# Formulários estilizados
npm install -D @tailwindcss/forms

# Tipografia
npm install -D @tailwindcss/typography

# Line clamp
npm install -D @tailwindcss/line-clamp

# Aspect ratio
npm install -D @tailwindcss/aspect-ratio
```

### 7. Dark Mode (Opcional)

**tailwind.config.js:**

```javascript
module.exports = {
  darkMode: 'class', // ou 'media'
  // ... resto da config
};
```

**Uso:**

```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Conteúdo adaptável ao dark mode
</div>
```

### 8. Boas Práticas com Tailwind

#### ✅ CORRETO:

```html
<!-- Classes organizadas e legíveis -->
<div
  class="
  flex items-center justify-between
  px-4 py-2
  bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
"
>
  Content
</div>

<!-- Usando @apply para classes repetidas -->
<button class="btn-custom">Click</button>
```

```css
/* No arquivo CSS do componente */
.btn-custom {
  @apply px-4 py-2 bg-primary-500 text-white rounded-lg
         hover:bg-primary-600 transition-colors;
}
```

#### ❌ EVITAR:

```html
<!-- Muitas classes inline dificulta leitura -->
<div
  class="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 mb-4 mt-2"
>
  <!-- Se tem muitas classes, considere criar uma classe customizada -->
</div>

<!-- Valores arbitrários excessivos -->
<div class="mt-4.25 pl-5.75">
  <!-- Use valores do tema -->
</div>
```

### 9. Purge/Content Configuration

O Tailwind automaticamente remove classes não utilizadas em produção com base na configuração `content` do `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/**/*.{html,ts}', // Analisa todos arquivos HTML e TS
  ],
  // ...
};
```

**⚠️ IMPORTANTE:** Evite criar classes dinamicamente:

```typescript
// ❌ EVITAR - Classes dinâmicas não serão detectadas
const statusClass = `bg-${status}-500`;

// ✅ CORRETO - Use mapeamento completo
const statusClasses = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};
const statusClass = statusClasses[status];
```

---

## 🧪 Testes

### 1. Estrutura de Testes

```typescript
// atividades.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AtividadesService } from './atividades.service';
import { Atividade } from '../models/atividade.model';
import { environment } from '@environments/environment';

describe('AtividadesService', () => {
  let service: AtividadesService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/atividades`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AtividadesService],
    });

    service = TestBed.inject(AtividadesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of atividades', () => {
      const mockAtividades: Atividade[] = [
        { id: 1, titulo: 'Atividade 1', descricao: 'Desc 1' },
        { id: 2, titulo: 'Atividade 2', descricao: 'Desc 2' },
      ];

      service.getAll().subscribe((atividades) => {
        expect(atividades.length).toBe(2);
        expect(atividades).toEqual(mockAtividades);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockAtividades);
    });
  });

  describe('create', () => {
    it('should create a new atividade', () => {
      const newAtividade: Atividade = {
        titulo: 'Nova Atividade',
        descricao: 'Descrição',
      };

      const createdAtividade: Atividade = {
        id: 1,
        ...newAtividade,
      };

      service.create(newAtividade).subscribe((atividade) => {
        expect(atividade).toEqual(createdAtividade);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newAtividade);
      req.flush(createdAtividade);
    });
  });
});
```

### 2. Testes de Componentes

```typescript
// atividades-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtividadesListComponent } from './atividades-list.component';
import { AtividadesService } from '../../services/atividades.service';
import { of } from 'rxjs';

describe('AtividadesListComponent', () => {
  let component: AtividadesListComponent;
  let fixture: ComponentFixture<AtividadesListComponent>;
  let mockAtividadesService: jasmine.SpyObj<AtividadesService>;

  beforeEach(async () => {
    mockAtividadesService = jasmine.createSpyObj('AtividadesService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [AtividadesListComponent],
      providers: [{ provide: AtividadesService, useValue: mockAtividadesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AtividadesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load atividades on init', () => {
    const mockAtividades = [
      { id: 1, titulo: 'Atividade 1' },
      { id: 2, titulo: 'Atividade 2' },
    ];

    mockAtividadesService.getAll.and.returnValue(of(mockAtividades));

    component.ngOnInit();

    expect(mockAtividadesService.getAll).toHaveBeenCalled();
  });

  it('should delete atividade when deletarAtividade is called', () => {
    const atividadeId = 1;
    mockAtividadesService.delete.and.returnValue(of(void 0));

    component.deletarAtividade(atividadeId);

    expect(mockAtividadesService.delete).toHaveBeenCalledWith(atividadeId);
  });
});
```

---

## ⚡ Performance

### 1. Lazy Loading

```typescript
// ✅ CORRETO - Lazy loading de módulos
const routes: Routes = [
  {
    path: 'atividades',
    loadChildren: () =>
      import('./features/atividades/atividades.module').then((m) => m.AtividadesModule),
  },
  {
    path: 'disciplinas',
    loadChildren: () =>
      import('./features/disciplinas/disciplinas.module').then((m) => m.DisciplinasModule),
  },
];
```

### 2. OnPush Change Detection

```typescript
// ✅ CORRETO
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtividadeCardComponent {
  @Input() atividade!: Atividade;
}
```

### 3. Unsubscribe Strategies

```typescript
// ✅ Melhor - Async Pipe
atividades$ = this.service.getAll();

// ✅ Bom - takeUntil
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe();
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 4. Otimização de Bundles

```typescript
// ✅ CORRETO - Imports específicos
import { map, filter } from 'rxjs/operators';

// ❌ EVITAR - Import de biblioteca inteira
import * as _ from 'lodash';

// ✅ CORRETO
import debounce from 'lodash-es/debounce';
```

---

## 🔒 Segurança

### 1. Sanitização

```typescript
// ✅ CORRETO - Sanitize user input
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string): SafeHtml {
  return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
}
```

### 2. Evitar Injeção de Código

```html
<!-- ❌ EVITAR - Vulnerável a XSS -->
<div [innerHTML]="userContent"></div>

<!-- ✅ CORRETO - Sanitizado -->
<div [innerHTML]="getSafeHtml(userContent)"></div>

<!-- ✅ MELHOR - Interpolação segura -->
<div>{{ userContent }}</div>
```

### 3. Environment Variables

```typescript
// ❌ EVITAR - Credenciais no código
const API_KEY = 'abc123xyz';

// ✅ CORRETO - Use environment files
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiKey: '', // Injetado em build time
};
```

---

## 📦 Models e Interfaces

### 1. Estrutura de Models

```typescript
// models/atividade.model.ts
export interface Atividade {
  id?: number;
  titulo: string;
  descricao?: string;
  prazo: Date;
  status: StatusAtividade;
  prioridade: number;
  disciplinaId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum StatusAtividade {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada',
}

export interface AtividadeCreateDto {
  titulo: string;
  descricao?: string;
  prazo: Date;
  disciplinaId: number;
  prioridade: number;
}

export interface AtividadeUpdateDto {
  titulo?: string;
  descricao?: string;
  prazo?: Date;
  status?: StatusAtividade;
  prioridade?: number;
}
```

### 2. Type Safety

```typescript
// ✅ CORRETO - Type guards
export function isAtividade(obj: any): obj is Atividade {
  return (
    obj &&
    typeof obj.titulo === 'string' &&
    typeof obj.prazo !== 'undefined' &&
    typeof obj.disciplinaId === 'number'
  );
}

// Uso
if (isAtividade(data)) {
  // TypeScript sabe que data é Atividade
  console.log(data.titulo);
}
```

---

## 📋 Checklist de Code Review

### Antes de Commitar

- [ ] Código segue as convenções de nomenclatura
- [ ] Não há console.log desnecessários
- [ ] Todos os imports estão sendo utilizados
- [ ] Componentes usam OnPush quando possível
- [ ] Subscriptions têm unsubscribe ou usam async pipe
- [ ] Formulários usam Reactive Forms
- [ ] Lógica de negócio está nos services
- [ ] Templates não têm lógica complexa
- [ ] Testes unitários foram criados/atualizados
- [ ] Código foi formatado (Prettier/ESLint)
- [ ] Não há código comentado
- [ ] Variáveis e funções têm nomes descritivos
- [ ] Não há magic numbers (use constantes)

### Performance

- [ ] Lazy loading está implementado
- [ ] TrackBy em todos os \*ngFor
- [ ] OnPush change detection onde aplicável
- [ ] Sem memory leaks (subscriptions)
- [ ] Imagens estão otimizadas

### Segurança

- [ ] User input está sanitizado
- [ ] Credenciais não estão no código
- [ ] Guards protegem rotas privadas
- [ ] Tokens são armazenados de forma segura

---

## 🛠️ Ferramentas Recomendadas

### Extensions VSCode

```json
{
  "recommendations": [
    "angular.ng-template",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "johnpapa.angular2",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### ESLint Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@angular-eslint/component-class-suffix": "error",
    "@angular-eslint/directive-class-suffix": "error"
  }
}
```

### Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "none",
  "semi": true,
  "printWidth": 100,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Angular Docs](https://angular.dev)
- [Angular Style Guide](https://angular.dev/style-guide)
- [RxJS Documentation](https://rxjs.dev)

### Comunidade

- [Angular Blog](https://blog.angular.dev)
- [Angular Discord](https://discord.gg/angular)
- Stack Overflow tag: `angular`

---

## 🎯 Resumo das Principais Regras

1. **Sempre use TypeScript strict mode**
2. **Prefira Reactive Forms sobre Template-driven**
3. **Use async pipe sempre que possível**
4. **Implemente OnPush change detection**
5. **Lazy load todos os feature modules**
6. **Nunca esqueça de unsubscribe (exceto com async pipe)**
7. **Mantenha componentes pequenos (<300 linhas)**
8. **Lógica de negócio nos services, não nos componentes**
9. **Use trackBy em todos os \*ngFor**
10. **Escreva testes para services críticos**

---

**Última atualização:** 2026-02-06  
**Versão Angular:** 21  
**Projeto:** Grimore Frontend
