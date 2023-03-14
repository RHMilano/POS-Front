import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaTiempoAireComponent } from './venta-tiempo-aire.component';

describe('VentaTiempoAireComponent', () => {
  let component: VentaTiempoAireComponent;
  let fixture: ComponentFixture<VentaTiempoAireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaTiempoAireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaTiempoAireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
