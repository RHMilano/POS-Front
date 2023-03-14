import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonesCancelacionComponent } from './razones-cancelacion.component';

describe('FormasDePagoComponent', () => {
  let component: RazonesCancelacionComponent;
  let fixture: ComponentFixture<RazonesCancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazonesCancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazonesCancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
