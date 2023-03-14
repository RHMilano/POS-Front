import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarTransaccionComponent } from './cancelar-transaccion.component';

describe('CancelarTransaccionComponent', () => {
  let component: CancelarTransaccionComponent;
  let fixture: ComponentFixture<CancelarTransaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelarTransaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
