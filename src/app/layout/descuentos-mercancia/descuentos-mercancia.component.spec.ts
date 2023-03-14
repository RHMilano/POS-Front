import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentosMercanciaComponent } from './descuentos-mercancia.component';

describe('DescuentosMercanciaComponent', () => {
  let component: DescuentosMercanciaComponent;
  let fixture: ComponentFixture<DescuentosMercanciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescuentosMercanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescuentosMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
