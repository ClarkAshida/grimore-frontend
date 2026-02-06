import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadesDetail } from './atividades-detail';

describe('AtividadesDetail', () => {
  let component: AtividadesDetail;
  let fixture: ComponentFixture<AtividadesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtividadesDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtividadesDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
