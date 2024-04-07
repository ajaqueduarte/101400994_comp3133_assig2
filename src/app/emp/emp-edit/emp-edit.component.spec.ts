import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEditComponent } from './emp-edit.component';

describe('EmpEditComponent', () => {
  let component: EmpEditComponent;
  let fixture: ComponentFixture<EmpEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
