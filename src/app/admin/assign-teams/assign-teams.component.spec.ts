import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTeamsComponent } from './assign-teams.component';

describe('AssignTeamsComponent', () => {
  let component: AssignTeamsComponent;
  let fixture: ComponentFixture<AssignTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTeamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
