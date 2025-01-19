import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionAdminComponent } from './production-admin.component';

describe('ProductionAdminComponent', () => {
  let component: ProductionAdminComponent;
  let fixture: ComponentFixture<ProductionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
