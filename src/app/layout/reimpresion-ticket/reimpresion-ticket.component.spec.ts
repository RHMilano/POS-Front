import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimpresionTicketComponent } from './reimpresion-ticket.component';

describe('ReimpresionTicketComponent', () => {
  let component: ReimpresionTicketComponent;
  let fixture: ComponentFixture<ReimpresionTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimpresionTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimpresionTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
