import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoFinanciamientoEmpleadoComponent } from './pago-financiamiento-empleado.component';

describe('PagoFinanciamientoEmpleadoComponent', () => {
  let component: PagoFinanciamientoEmpleadoComponent;
  let fixture: ComponentFixture<PagoFinanciamientoEmpleadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoFinanciamientoEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoFinanciamientoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
