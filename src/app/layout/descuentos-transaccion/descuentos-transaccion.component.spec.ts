import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentosTransaccionComponent } from './descuentos-transaccion.component';

describe('DescuentosTransaccionComponent', () => {
  let component: DescuentosTransaccionComponent;
  let fixture: ComponentFixture<DescuentosTransaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescuentosTransaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescuentosTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
