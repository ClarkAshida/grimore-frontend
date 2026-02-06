import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-code.html',
  styleUrls: ['./verify-code.css'],
})
export class VerifyCode implements OnInit {
  email = signal('');
  code = signal<string[]>(['', '', '', '', '', '']);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // Auto-focus behavior effect
    effect(() => {
      const currentCode = this.code();
      if (currentCode.every((digit) => digit !== '')) {
        this.verifyCode();
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.email.set(params['email']);
      }
    });
  }

  onInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length > 1) {
      // Se colou múltiplos dígitos
      const digits = value.split('').slice(0, 6);
      const newCode = [...this.code()];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      this.code.set(newCode);

      // Focar no próximo input vazio ou no último
      const nextIndex = Math.min(index + digits.length, 5);
      this.focusInput(nextIndex);
    } else if (value.length === 1) {
      // Um único dígito digitado
      const newCode = [...this.code()];
      newCode[index] = value;
      this.code.set(newCode);

      // Focar no próximo input
      if (index < 5) {
        this.focusInput(index + 1);
      }
    }

    this.errorMessage.set('');
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      const newCode = [...this.code()];
      if (newCode[index] === '' && index > 0) {
        // Se está vazio, volta para o anterior
        this.focusInput(index - 1);
      } else {
        // Limpa o atual
        newCode[index] = '';
        this.code.set(newCode);
      }
      this.errorMessage.set('');
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.focusInput(index + 1);
    }
  }

  focusInput(index: number) {
    setTimeout(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('.code-input');
      if (inputs[index]) {
        inputs[index].focus();
        inputs[index].select();
      }
    }, 0);
  }

  verifyCode() {
    const fullCode = this.code().join('');
    if (fullCode.length === 6) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      // Mock - substituir por chamada HTTP real
      setTimeout(() => {
        if (fullCode === '123456') {
          // Código correto
          this.isLoading.set(false);
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { token: 'mock-token-12345' },
          });
        } else {
          // Código incorreto
          this.isLoading.set(false);
          this.errorMessage.set('Código inválido');
          this.code.set(['', '', '', '', '', '']);
          this.focusInput(0);
        }
      }, 1000);
    }
  }

  resendCode() {
    this.errorMessage.set('');
    console.log('Reenviando código para:', this.email());
    // Mock - substituir por chamada HTTP real
  }

  hasEmptyDigit(): boolean {
    return this.code().some((d) => d === '');
  }
}
