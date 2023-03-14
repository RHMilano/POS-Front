import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiroEgresosComponent } from './retiro-egresos.component';

describe('RetiroEgresosComponent', () => {
  let component: RetiroEgresosComponent;
  let fixture: ComponentFixture<RetiroEgresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetiroEgresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetiroEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
