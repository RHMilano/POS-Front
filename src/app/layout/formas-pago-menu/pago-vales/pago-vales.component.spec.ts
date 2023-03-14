import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoValesComponent } from './pago-vales.component';

describe('PagoValesComponent', () => {
  let component: PagoValesComponent;
  let fixture: ComponentFixture<PagoValesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoValesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoValesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
