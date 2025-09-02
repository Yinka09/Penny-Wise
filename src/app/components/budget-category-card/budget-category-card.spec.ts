import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryCard } from './budget-category-card';

describe('BudgetCategoryCard', () => {
  let component: BudgetCategoryCard;
  let fixture: ComponentFixture<BudgetCategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCategoryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
