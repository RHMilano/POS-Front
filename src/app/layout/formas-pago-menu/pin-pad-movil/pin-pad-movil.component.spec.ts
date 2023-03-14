import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {PinPadMovilComponent} from './pin-pad-movil.component';


describe('PinPadMovilComponent', () => {
  let component: PinPadMovilComponent;
  let fixture: ComponentFixture<PinPadMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinPadMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinPadMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
