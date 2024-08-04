import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusValuesComponent } from './status-values.component';

describe('StatusValuesComponent', () => {
  let component: StatusValuesComponent;
  let fixture: ComponentFixture<StatusValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusValuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
