import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentosInformacionComponent } from './descuentos-informacion.component';

describe('DescuentosInformacionComponent', () => {
  let component: DescuentosInformacionComponent;
  let fixture: ComponentFixture<DescuentosInformacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescuentosInformacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescuentosInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
