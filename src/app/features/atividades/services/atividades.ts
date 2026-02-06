import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Atividade } from '../models/atividade.model';

@Injectable({
  providedIn: 'root',
})
export class AtividadesService {
  constructor() {}

  getAtividades(): Observable<Atividade[]> {
    // Mock data - substituir por chamada HTTP real
    return of([]);
  }

  getAtividadeById(id: string): Observable<Atividade> {
    // Mock data - substituir por chamada HTTP real
    return of({} as Atividade);
  }

  createAtividade(atividade: Partial<Atividade>): Observable<Atividade> {
    // Mock data - substituir por chamada HTTP real
    return of({} as Atividade);
  }

  updateAtividade(id: string, atividade: Partial<Atividade>): Observable<Atividade> {
    // Mock data - substituir por chamada HTTP real
    return of({} as Atividade);
  }

  deleteAtividade(id: string): Observable<void> {
    // Mock data - substituir por chamada HTTP real
    return of(void 0);
  }

  toggleConcluida(id: string): Observable<Atividade> {
    // Mock data - substituir por chamada HTTP real
    return of({} as Atividade);
  }
}
