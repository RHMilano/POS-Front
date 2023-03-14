import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormasPagoMenuComponent} from './formas-pago-menu.component';

describe('FormasPagoMenuComponent', () => {
  let component: FormasPagoMenuComponent;
  let fixture: ComponentFixture<FormasPagoMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormasPagoMenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormasPagoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
