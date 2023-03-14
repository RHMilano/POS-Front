import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutenticacionOfflineComponent } from './autenticacion-offline.component';

describe('AutenticacionOfflineComponent', () => {
  let component: AutenticacionOfflineComponent;
  let fixture: ComponentFixture<AutenticacionOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutenticacionOfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutenticacionOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
