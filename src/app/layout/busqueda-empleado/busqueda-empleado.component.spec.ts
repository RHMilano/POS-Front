import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaEmpleadoComponent } from './busqueda-empleado.component';

describe('BusquedaEmpleadoComponent', () => {
  let component: BusquedaEmpleadoComponent;
  let fixture: ComponentFixture<BusquedaEmpleadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
