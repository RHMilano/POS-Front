import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketVirtualDevolucionComponent } from './ticket-virtual-devolucion.component';

describe('TicketVirtualDevolucionComponent', () => {
  let component: TicketVirtualDevolucionComponent;
  let fixture: ComponentFixture<TicketVirtualDevolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketVirtualDevolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketVirtualDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
