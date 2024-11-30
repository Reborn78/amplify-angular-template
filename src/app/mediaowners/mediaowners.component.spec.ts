import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaownersComponent } from './mediaowners.component';

describe('MediaownersComponent', () => {
  let component: MediaownersComponent;
  let fixture: ComponentFixture<MediaownersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaownersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaownersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
