import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgChartComponent } from './ag-chart';

describe('AgChartComponent', () => {
  let component: AgChartComponent;
  let fixture: ComponentFixture<AgChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
