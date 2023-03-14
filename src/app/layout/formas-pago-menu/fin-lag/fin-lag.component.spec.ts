import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinLagComponent } from './fin-lag.component';

describe('FinLagComponent', () => {
  let component: FinLagComponent;
  let fixture: ComponentFixture<FinLagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinLagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinLagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
