import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoFinLagComponent } from './pago-fin-lag.component';

describe('PagoFinLagComponent', () => {
  let component: PagoFinLagComponent;
  let fixture: ComponentFixture<PagoFinLagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoFinLagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoFinLagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
