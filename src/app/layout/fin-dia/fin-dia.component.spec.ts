import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinDiaComponent } from './fin-dia.component';

describe('FinDiaComponent', () => {
  let component: FinDiaComponent;
  let fixture: ComponentFixture<FinDiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinDiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
