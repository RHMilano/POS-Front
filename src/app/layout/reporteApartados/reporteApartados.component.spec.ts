import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteApartadosComponent } from './reporteApartados.component';

describe('ReporteApartadosComponent', () => {
  let component: ReporteApartadosComponent;
  let fixture: ComponentFixture<ReporteApartadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteApartadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteApartadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
