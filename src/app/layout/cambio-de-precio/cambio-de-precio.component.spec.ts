import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioDePrecioComponent } from './cambio-de-precio.component';

describe('CambioDePrecioComponent', () => {
  let component: CambioDePrecioComponent;
  let fixture: ComponentFixture<CambioDePrecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioDePrecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioDePrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
