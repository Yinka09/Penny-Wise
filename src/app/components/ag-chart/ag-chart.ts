import { Component, Input, type OnInit } from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { IChartData } from '../../models/interfaces';

@Component({
  selector: 'app-ag-chart',
  imports: [AgCharts],
  templateUrl: './ag-chart.html',
  styleUrls: ['./ag-chart.scss'],
})
export class AgChartComponent implements OnInit {
  @Input() monthName!: string;
  @Input() year!: number;
  @Input() data!: IChartData[];
  public options!: AgChartOptions;

  constructor() {}

  ngOnInit(): void {
    this.options = {
      data: this.data,
      title: {
        text: 'Expenses for ' + this.monthName + ' ' + this.year,
      },
      series: [
        {
          type: 'pie',
          angleKey: 'amount',
          legendItemKey: 'expense',
        },
      ],
    };
  }
}
