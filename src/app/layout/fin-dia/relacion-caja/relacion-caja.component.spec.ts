import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionCajaComponent } from './relacion-caja.component';

describe('RelacionCajaComponent', () => {
  let component: RelacionCajaComponent;
  let fixture: ComponentFixture<RelacionCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelacionCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
