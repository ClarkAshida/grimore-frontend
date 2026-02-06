import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadesList } from './atividades-list';

describe('AtividadesList', () => {
  let component: AtividadesList;
  let fixture: ComponentFixture<AtividadesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtividadesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtividadesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
