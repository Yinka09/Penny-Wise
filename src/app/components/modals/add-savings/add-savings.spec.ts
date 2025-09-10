import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSavings } from './add-savings';

describe('AddSavings', () => {
  let component: AddSavings;
  let fixture: ComponentFixture<AddSavings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSavings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSavings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
