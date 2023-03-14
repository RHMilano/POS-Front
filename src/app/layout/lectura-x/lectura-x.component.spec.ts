import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaXComponent } from './lectura-x.component';

describe('LecturaXComponent', () => {
  let component: LecturaXComponent;
  let fixture: ComponentFixture<LecturaXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturaXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
