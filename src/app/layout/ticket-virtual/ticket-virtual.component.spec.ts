import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketVirtualComponent } from './ticket-virtual.component';

describe('TicketVirtualComponent', () => {
  let component: TicketVirtualComponent;
  let fixture: ComponentFixture<TicketVirtualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TicketVirtualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
