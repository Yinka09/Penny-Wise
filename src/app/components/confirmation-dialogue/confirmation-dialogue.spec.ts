import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogue } from './confirmation-dialogue';

describe('ConfirmationDialogue', () => {
  let component: ConfirmationDialogue;
  let fixture: ComponentFixture<ConfirmationDialogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
