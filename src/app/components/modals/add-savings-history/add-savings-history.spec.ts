import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSavingsHistory } from './add-savings-history';

describe('AddSavingsHistory', () => {
  let component: AddSavingsHistory;
  let fixture: ComponentFixture<AddSavingsHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSavingsHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSavingsHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
