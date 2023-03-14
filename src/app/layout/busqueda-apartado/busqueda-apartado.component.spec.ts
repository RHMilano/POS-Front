import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaApartadoComponent } from './busqueda-apartado.component';

describe('BusquedaApartadoComponent', () => {
  let component: BusquedaApartadoComponent;
  let fixture: ComponentFixture<BusquedaApartadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaApartadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaApartadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
