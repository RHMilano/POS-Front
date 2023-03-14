import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketVirtualMayoristaComponent } from './ticket-virtual-mayorista.component';

describe('TicketVirtualMayoristaComponent', () => {
  let component: TicketVirtualMayoristaComponent;
  let fixture: ComponentFixture<TicketVirtualMayoristaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketVirtualMayoristaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketVirtualMayoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
