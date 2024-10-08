import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionsComponent } from './evolutions.component';

describe('EvolutionsComponent', () => {
  let component: EvolutionsComponent;
  let fixture: ComponentFixture<EvolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
