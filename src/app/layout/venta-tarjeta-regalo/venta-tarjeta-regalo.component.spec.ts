import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaTarjetaRegaloComponent } from './venta-tarjeta-regalo.component';

describe('VentaTarjetaRegaloComponent', () => {
  let component: VentaTarjetaRegaloComponent;
  let fixture: ComponentFixture<VentaTarjetaRegaloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaTarjetaRegaloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaTarjetaRegaloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
