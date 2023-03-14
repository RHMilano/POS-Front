import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaMayoristaComponent } from './busqueda-mayorista.component';

describe('BusquedaMayoristaComponent', () => {
  let component: BusquedaMayoristaComponent;
  let fixture: ComponentFixture<BusquedaMayoristaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaMayoristaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaMayoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
