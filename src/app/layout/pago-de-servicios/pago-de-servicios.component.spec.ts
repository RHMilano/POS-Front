import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoDeServiciosComponent } from './pago-de-servicios.component';

describe('PagoDeServiciosComponent', () => {
  let component: PagoDeServiciosComponent;
  let fixture: ComponentFixture<PagoDeServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoDeServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDeServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
