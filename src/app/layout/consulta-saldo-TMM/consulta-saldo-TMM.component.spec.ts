import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaSaldoTMMComponent } from './consulta-saldo-TMM.component';

describe('ConsultaSaldoTMMComponent', () => {
  let component: ConsultaSaldoTMMComponent;
  let fixture: ComponentFixture<ConsultaSaldoTMMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaSaldoTMMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaSaldoTMMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
