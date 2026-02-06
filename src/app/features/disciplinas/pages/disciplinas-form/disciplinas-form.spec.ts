import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinasForm } from './disciplinas-form';

describe('DisciplinasForm', () => {
  let component: DisciplinasForm;
  let fixture: ComponentFixture<DisciplinasForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinasForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinasForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
