import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFormComponentComponent } from './post-form-component.component';

describe('PostFormComponentComponent', () => {
  let component: PostFormComponentComponent;
  let fixture: ComponentFixture<PostFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostFormComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
