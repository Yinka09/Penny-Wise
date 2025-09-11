import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSection } from './grid-section';

describe('GridSection', () => {
  let component: GridSection;
  let fixture: ComponentFixture<GridSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
