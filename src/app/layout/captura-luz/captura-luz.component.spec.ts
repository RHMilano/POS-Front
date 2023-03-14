import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturaLuzComponent } from './captura-luz.component';

describe('CapturaLuzComponent', () => {
  let component: CapturaLuzComponent;
  let fixture: ComponentFixture<CapturaLuzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturaLuzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturaLuzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
