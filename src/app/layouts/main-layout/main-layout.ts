import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  isModalOpen = signal(false);
  uploadProgress = signal(0);
  userName = signal('Estudante');
  currentDate = signal(this.formatDate());

  userInitials() {
    return this.userName()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(): string {
    const days = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    const months = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ];

    const now = new Date();
    const dayName = days[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = months[now.getMonth()];

    return `${dayName}, ${day} de ${month}`;
  }

  openUploadModal(): void {
    this.isModalOpen.set(true);
    this.uploadProgress.set(0);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.uploadProgress.set(0);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    if (file.type !== 'application/pdf') {
      alert('Por favor, envie apenas arquivos PDF');
      return;
    }

    // Simular upload com progresso
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      this.uploadProgress.set(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.closeModal();
          // TODO: Processar arquivo com IA e extrair informações
          console.log('Upload completo:', file.name);
        }, 500);
      }
    }, 200);
  }

  skipSetup(): void {
    this.closeModal();
    // TODO: Navegar para configuração manual
    console.log('Setup manual');
  }
}
