import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword {
  form: FormGroup;
  isLoading = signal(false);
  emailSent = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);

      // Mock - substituir por chamada HTTP real
      setTimeout(() => {
        console.log('Enviando email de recuperação para:', this.form.value.email);
        this.isLoading.set(false);
        this.emailSent.set(true);

        // Redirecionar para verificação de código após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/verify-code'], {
            queryParams: { email: this.form.value.email },
          });
        }, 2000);
      }, 1500);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/auth/login']);
  }
}
