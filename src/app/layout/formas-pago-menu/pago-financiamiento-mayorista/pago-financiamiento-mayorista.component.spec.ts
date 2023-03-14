import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoFinanciamientoMayoristaComponent } from './pago-financiamiento-mayorista.component';

describe('PagoFinanciamientoMayoristaComponent', () => {
  let component: PagoFinanciamientoMayoristaComponent;
  let fixture: ComponentFixture<PagoFinanciamientoMayoristaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoFinanciamientoMayoristaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoFinanciamientoMayoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
