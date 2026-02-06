import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  profileForm: FormGroup;
  isEditing = signal(false);
  isLoading = signal(false);
  showDeleteModal = signal(false);
  showSuccessMessage = signal(false);

  // Mock de dados do usuário
  userData = signal({
    nome: 'João Silva',
    email: 'joao.silva@universidade.edu',
    curso: 'Ciência da Computação',
    periodo: '5º Período',
    matricula: '2021001234',
    telefone: '(11) 98765-4321',
    dataNascimento: '15/03/2000',
    fotoPerfil: '',
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      nome: [{ value: this.userData().nome, disabled: true }, [Validators.required]],
      email: [
        { value: this.userData().email, disabled: true },
        [Validators.required, Validators.email],
      ],
      curso: [{ value: this.userData().curso, disabled: true }],
      periodo: [{ value: this.userData().periodo, disabled: true }],
      matricula: [{ value: this.userData().matricula, disabled: true }],
      telefone: [{ value: this.userData().telefone, disabled: true }],
      dataNascimento: [{ value: this.userData().dataNascimento, disabled: true }],
    });
  }

  userInitials(): string {
    return this.userData()
      .nome.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleEdit(): void {
    this.isEditing.update((v) => !v);

    if (this.isEditing()) {
      // Habilita campos editáveis
      this.profileForm.get('nome')?.enable();
      this.profileForm.get('telefone')?.enable();
    } else {
      // Desabilita e cancela edição
      this.profileForm.get('nome')?.disable();
      this.profileForm.get('telefone')?.disable();
      this.profileForm.patchValue(this.userData());
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading.set(true);

      // Mock - substituir por chamada HTTP real
      setTimeout(() => {
        const updatedData = {
          ...this.userData(),
          nome: this.profileForm.get('nome')?.value,
          telefone: this.profileForm.get('telefone')?.value,
        };

        this.userData.set(updatedData);
        this.isEditing.set(false);
        this.isLoading.set(false);
        this.showSuccessMessage.set(true);

        // Desabilita campos novamente
        this.profileForm.get('nome')?.disable();
        this.profileForm.get('telefone')?.disable();

        setTimeout(() => {
          this.showSuccessMessage.set(false);
        }, 3000);

        console.log('Perfil atualizado:', updatedData);
      }, 1000);
    }
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  requestAccountDeletion(): void {
    this.isLoading.set(true);

    // Mock - substituir por chamada HTTP real
    setTimeout(() => {
      console.log('Solicitação de exclusão enviada');
      this.isLoading.set(false);
      this.showDeleteModal.set(false);
      alert(
        'Solicitação enviada! Você receberá um email com instruções para confirmar a exclusão da sua conta.',
      );
    }, 1500);
  }

  changePassword(): void {
    this.router.navigate(['/auth/reset-password']);
  }

  changeProfilePicture(): void {
    // TODO: Implementar upload de foto
    console.log('Alterar foto de perfil');
  }
}
