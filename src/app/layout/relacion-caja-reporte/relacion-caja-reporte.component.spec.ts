import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionCajaReporteComponent } from './relacion-caja-reporte.component';

describe('RelacionCajaComponent', () => {
  let component: RelacionCajaReporteComponent;
  let fixture: ComponentFixture<RelacionCajaReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelacionCajaReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionCajaReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
