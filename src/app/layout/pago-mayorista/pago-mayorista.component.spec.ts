import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMayoristaComponent } from './pago-mayorista.component';

describe('PagoMayoristaComponent', () => {
  let component: PagoMayoristaComponent;
  let fixture: ComponentFixture<PagoMayoristaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoMayoristaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoMayoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
