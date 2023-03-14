import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoTarjetaCreditoDebitoComponent } from './pago-tarjeta-credito-debito.component';

describe('PagoTarjetaCreditoDebitoComponent', () => {
  let component: PagoTarjetaCreditoDebitoComponent;
  let fixture: ComponentFixture<PagoTarjetaCreditoDebitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoTarjetaCreditoDebitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoTarjetaCreditoDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
