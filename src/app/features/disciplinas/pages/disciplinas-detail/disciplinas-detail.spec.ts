import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinasDetail } from './disciplinas-detail';

describe('DisciplinasDetail', () => {
  let component: DisciplinasDetail;
  let fixture: ComponentFixture<DisciplinasDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinasDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinasDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
