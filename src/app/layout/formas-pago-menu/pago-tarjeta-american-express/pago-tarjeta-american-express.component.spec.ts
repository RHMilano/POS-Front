import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoTarjetaAmericanExpressComponent } from './pago-tarjeta-american-express.component';

describe('PagoTarjetaAmericanExpressComponent', () => {
  let component: PagoTarjetaAmericanExpressComponent;
  let fixture: ComponentFixture<PagoTarjetaAmericanExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoTarjetaAmericanExpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoTarjetaAmericanExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
