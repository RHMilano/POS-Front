import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedencionDeCuponesComponent } from './redencion-de-cupones.component';

describe('RedencionDeCuponesComponent', () => {
  let component: RedencionDeCuponesComponent;
  let fixture: ComponentFixture<RedencionDeCuponesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedencionDeCuponesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedencionDeCuponesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
