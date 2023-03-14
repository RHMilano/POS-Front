import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaZComponent } from './lectura-z.component';

describe('LecturaZComponent', () => {
  let component: LecturaZComponent;
  let fixture: ComponentFixture<LecturaZComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturaZComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaZComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
