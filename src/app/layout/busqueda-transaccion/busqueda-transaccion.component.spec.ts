import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaTransaccionComponent } from './busqueda-transaccion.component';



describe('BusquedaTransaccionComponent', () => {
  let component: BusquedaTransaccionComponent;
  let fixture: ComponentFixture<BusquedaTransaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaTransaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
