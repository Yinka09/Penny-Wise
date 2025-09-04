import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyInsights } from './key-insights';

describe('KeyInsights', () => {
  let component: KeyInsights;
  let fixture: ComponentFixture<KeyInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyInsights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyInsights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
