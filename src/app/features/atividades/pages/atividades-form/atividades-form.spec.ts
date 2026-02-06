import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadesForm } from './atividades-form';

describe('AtividadesForm', () => {
  let component: AtividadesForm;
  let fixture: ComponentFixture<AtividadesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtividadesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtividadesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
