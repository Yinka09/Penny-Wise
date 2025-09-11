import { Injectable } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard';
import { TransactionsService } from '../transactions/transactions';
import { BudgetsService } from '../budgets/budgets';
import { SavingsService } from '../savings/savings-service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private dashboardService: DashboardService,
    private transactionsService: TransactionsService,
    private budgetService: BudgetsService,
    private savingsService: SavingsService
  ) {}
  // getData() {
  //   const DonutChartCdata = this.dashboardService.chartData();
  //   return DonutChartCdata;
  // }

  getTotalSavings() {
    return this.savingsService.totalSavingsBalance();
  }

  getTotalTargetedSavings() {
    return this.savingsService.getAllTargetedSavingsAmount();
  }
  getDonutChartConfig() {
    const DonutChartCdata = this.dashboardService.chartData();
    const TotalExpense = this.dashboardService.getTotalExpenses();
    return {
      data: DonutChartCdata,
      title: {
        text: 'Expense by Category',
      },
      series: [
        {
          type: 'donut',
          calloutLabelKey: 'expense',
          angleKey: 'amount',
          innerRadiusRatio: 0.9,
          innerLabels: [
            {
              text: 'Total Expense',
              fontWeight: 'bold',
            },
            {
              text: this.valueFormatter(TotalExpense),
              spacing: 1,
              fontSize: 12,
              color: 'black',
              fontWeight: 'normal',
            },
          ],
          innerCircle: {
            fill: '#c9fdc9',
          },
        },
      ],
    };
  }

  getLineChartConfig() {
    return {
      title: {
        text: 'Budget VS Actual Expense',
      },
      subtitle: {
        text: 'A Comparision of Planned VS Actual Spending',
      },
      data: this.getLineChartData().chartData,
      series: this.getLineChartData().chartSeries,
    };
  }

  getLineChartData() {
    const budgetCategories = this.budgetService.budgetCardData();
    let chartSeries = [
      {
        type: 'line',
        xKey: 'category',
        yKey: 'Amount Budgeted',
        yName: 'Amount Budgeted',
      },
      {
        type: 'line',
        xKey: 'category',
        yKey: 'Amount Spent',
        yName: 'Amount Spent',
      },
    ];

    let chartData: { category: string; [key: string]: number | string }[] = [];
    for (let budget of budgetCategories) {
      const dataEntry = {
        category: budget.budgetCategory,
        ['Amount Budgeted']: budget.amountBudgeted,
        ['Amount Spent']: budget.amountSpent,
      };

      chartData.push(dataEntry);
    }
    return { chartData, chartSeries };
  }

  getBarChartConfig() {
    return {
      title: {
        text: 'Income Expense Trend',
      },
      subtitle: {
        text: 'In the past 10 days',
      },
      data: this.getBarChartData().chartData,
      series: this.getBarChartData().chartSeries,
    };
  }

  getBarChartData() {
    const allTransactions = this.transactionsService.allTransactions();
    const lastTenDays = this.getLastNDays(10);

    let chartSeries = [
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'Income',
        yName: 'Income',
      },
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'Expense',
        yName: 'Expense',
      },
    ];

    let chartData: { date: string; [key: string]: number | string }[] = [];

    for (let date of lastTenDays) {
      const dataEntry = { date: date.date, Income: 0, Expense: 0 };

      for (let txn of allTransactions) {
        const formattedTxnDate = new Date(txn.date).toLocaleDateString('en-GB');

        if (formattedTxnDate === date.date) {
          if (txn.type === 'Income') {
            dataEntry.Income += txn.amount;
          } else if (txn.type === 'Expense') {
            dataEntry.Expense += txn.amount;
          }
        }
      }

      chartData.push(dataEntry);
    }

    return { chartData, chartSeries };
  }

  getLastNDays(n: number): { day: string; date: string }[] {
    const days: { day: string; date: string }[] = [];
    const today = new Date();

    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const date = d.toLocaleDateString('en-GB');

      days.push({ day: dayName, date });
    }

    return days.reverse();
  }

  valueFormatter(value: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  }
}
