import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoTcmmComponent } from './pago-tcmm.component';

describe('PagoTcmmComponent', () => {
  let component: PagoTcmmComponent;
  let fixture: ComponentFixture<PagoTcmmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoTcmmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoTcmmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
