import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketVirtualEmpleadoComponent } from './ticket-virtual-empleado.component';

describe('TicketVirtualEmpleadoComponent', () => {
  let component: TicketVirtualEmpleadoComponent;
  let fixture: ComponentFixture<TicketVirtualEmpleadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketVirtualEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketVirtualEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
