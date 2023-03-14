import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperUsuarioComponent } from './super-usuario.component';

describe('SuperUsuarioComponent', () => {
  let component: SuperUsuarioComponent;
  let fixture: ComponentFixture<SuperUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
