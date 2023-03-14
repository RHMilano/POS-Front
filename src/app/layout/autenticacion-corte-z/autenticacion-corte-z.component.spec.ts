import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutenticacionCorteZComponent } from './autenticacion-corte-z.component';

describe('AutenticacionOfflineComponent', () => {
  let component: AutenticacionCorteZComponent;
  let fixture: ComponentFixture<AutenticacionCorteZComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutenticacionCorteZComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutenticacionCorteZComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
