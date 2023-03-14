import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoTarjetaRegaloComponent } from './pago-tarjeta-regalo.component';

describe('PagoTarjetaRegaloComponent', () => {
  let component: PagoTarjetaRegaloComponent;
  let fixture: ComponentFixture<PagoTarjetaRegaloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoTarjetaRegaloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoTarjetaRegaloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
