import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsHistoryComponent } from './savings-history';

describe('SavingsHistoryComponent', () => {
  let component: SavingsHistoryComponent;
  let fixture: ComponentFixture<SavingsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
