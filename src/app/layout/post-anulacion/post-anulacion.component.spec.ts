import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PostAnulacionComponent } from './post-anulacion.component';



describe('PostAnulacionComponent', () => {
  let component: PostAnulacionComponent;
  let fixture: ComponentFixture<PostAnulacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostAnulacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
