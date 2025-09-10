import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsCard } from './savings-card';

describe('SavingsCard', () => {
  let component: SavingsCard;
  let fixture: ComponentFixture<SavingsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
