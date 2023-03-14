import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMonedaExtranjeraComponent } from './pago-moneda-extranjera.component';

describe('PagoMonedaExtranjeraComponent', () => {
  let component: PagoMonedaExtranjeraComponent;
  let fixture: ComponentFixture<PagoMonedaExtranjeraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoMonedaExtranjeraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoMonedaExtranjeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
