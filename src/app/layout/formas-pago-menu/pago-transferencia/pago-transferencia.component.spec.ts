import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoTransferenciaComponent } from './pago-transferencia.component';

describe('PagoTransferenciaComponent', () => {
  let component: PagoTransferenciaComponent;
  let fixture: ComponentFixture<PagoTransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoTransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
