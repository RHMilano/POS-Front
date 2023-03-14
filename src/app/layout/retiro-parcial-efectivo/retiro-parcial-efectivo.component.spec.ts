import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiroParcialEfectivoComponent } from './retiro-parcial-efectivo.component';

describe('RetiroParcialEfectivoComponent', () => {
  let component: RetiroParcialEfectivoComponent;
  let fixture: ComponentFixture<RetiroParcialEfectivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetiroParcialEfectivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetiroParcialEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
