import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword {
  form: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  passwordStrength = signal<'weak' | 'medium' | 'strong'>('weak');
  token = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );

    // Monitor password strength
    this.form.get('password')?.valueChanges.subscribe((password) => {
      this.calculatePasswordStrength(password);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        this.token.set(params['token']);
      } else {
        // Se não tiver token, redirecionar
        this.router.navigate(['/auth/login']);
      }
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  calculatePasswordStrength(password: string) {
    if (!password || password.length < 4) {
      this.passwordStrength.set('weak');
    } else if (password.length < 8) {
      this.passwordStrength.set('medium');
    } else {
      // Verificar complexidade
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const complexityScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
        Boolean,
      ).length;

      if (complexityScore >= 3 && password.length >= 12) {
        this.passwordStrength.set('strong');
      } else if (complexityScore >= 2 && password.length >= 8) {
        this.passwordStrength.set('medium');
      } else {
        this.passwordStrength.set('weak');
      }
    }
  }

  getStrengthPercentage(): number {
    switch (this.passwordStrength()) {
      case 'weak':
        return 25;
      case 'medium':
        return 50;
      case 'strong':
        return 100;
      default:
        return 0;
    }
  }

  getStrengthLabel(): string {
    switch (this.passwordStrength()) {
      case 'weak':
        return 'Fraca';
      case 'medium':
        return 'Média';
      case 'strong':
        return 'Forte';
      default:
        return '';
    }
  }

  getStrengthColor(): string {
    switch (this.passwordStrength()) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'strong':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-200';
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);

      // Mock - substituir por chamada HTTP real
      setTimeout(() => {
        console.log('Redefinindo senha com token:', this.token());
        console.log('Nova senha:', this.form.value.password);
        this.isLoading.set(false);

        // Redirecionar para login
        this.router.navigate(['/auth/login'], {
          queryParams: { passwordReset: 'success' },
        });
      }, 1500);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/auth/login']);
  }
}
