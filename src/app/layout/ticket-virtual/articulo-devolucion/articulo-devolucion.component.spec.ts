import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloDevolucionComponent } from './articulo-devolucion.component';

describe('ArticuloDevolucionComponent', () => {
  let component: ArticuloDevolucionComponent;
  let fixture: ComponentFixture<ArticuloDevolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticuloDevolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticuloDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
