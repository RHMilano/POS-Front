import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaClienteFinLagComponent } from './busqueda-cliente-finLag.component';

describe('BusquedaClienteComponent', () => {
  let component: BusquedaClienteFinLagComponent;
  let fixture: ComponentFixture<BusquedaClienteFinLagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaClienteFinLagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaClienteFinLagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
