import { TestBed } from '@angular/core/testing';

import { Disciplinas } from './disciplinas';

describe('Disciplinas', () => {
  let service: Disciplinas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Disciplinas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
