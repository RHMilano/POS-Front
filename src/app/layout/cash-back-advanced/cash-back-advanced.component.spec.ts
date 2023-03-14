import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBackAdvancedComponent } from './cash-back-advanced.component';

describe('CashBackAdvancedComponent', () => {
  let component: CashBackAdvancedComponent;
  let fixture: ComponentFixture<CashBackAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashBackAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashBackAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
