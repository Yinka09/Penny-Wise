import { computed, effect, Injectable, signal } from '@angular/core';
import { TransactionsService } from '../transactions/transactions';
import { ICardData } from '../../models/interfaces';
import { SavingsService } from '../savings/savings-service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  cardData: ICardData[] = [];
  totalBalance = signal<number>(this.fetchTotalBalanceFromStorage());
  incomeArray = signal<number[]>([]);
  expenseArray = signal<number[]>([]);
  categoryAmountObj = signal<{ category: string; amount: number } | null>(null);

  categoryTotals = signal<Record<string, number>>({});
  chartData = computed(() => {
    const expenses = this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Expense');

    const totals: Record<string, number> = {};
    for (const txn of expenses) {
      totals[txn.category] = (totals[txn.category] || 0) + txn.amount;
    }

    return Object.entries(totals).map(([category, amount]) => ({
      expense: category,
      amount,
    }));
  });

  highestExpenseCategory = computed(() => {
    const totals = this.updateCategoryTotals();

    let maxCategory = '';
    let maxAmount = 0;

    for (const [category, amount] of Object.entries(totals)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategory = category;
      }
    }

    return { category: maxCategory, amount: maxAmount };
  });

  constructor(
    private transactionService: TransactionsService,
    private savingsService: SavingsService
  ) {}

  createDashboardCards = computed(() => {
    const cardData = [
      {
        title: 'Total Budget',
        amount: this.totalBalance(),
        description: 'Total budget for',
        icon: 'fa-coins',
        iconBg: '#E1BFF399',
        percentage: this.getTotalBalancePercentage(this.totalBalance()),
      },
      {
        title: 'Total Income',
        amount: this.getTotalIncome(),
        description: 'Total income for',
        icon: 'fa-hand-holding-dollar',
        iconBg: '#048E3B1A',
        percentage: this.getTotalBalancePercentage(this.getTotalIncome()),
      },
      {
        title: 'Total Expenses',
        amount: this.getTotalExpenses(),
        description: 'Total expenses for ',
        icon: 'fa-money-bill-transfer',
        iconBg: '#DFA2261A',
        percentage: this.getTotalBalancePercentage(this.getTotalExpenses()),
      },
      {
        title: 'Total Savings',
        amount: this.savingsService.totalSavingsBalance(),
        description: 'Total savings for',
        icon: 'fa-piggy-bank',
        iconBg: '#E113131A',
        percentage: this.getTotalBalancePercentage(
          this.savingsService.totalSavingsBalance()
        ),
      },
      // {
      //   title: 'Top Category',
      //   amount: this.highestExpenseCategory().amount,
      //   description: this.highestExpenseCategory().category + ' expenses for',
      //   icon: 'fa-money-bill-trend-up',
      //   iconBg: '#E113131A',
      //   percentage: this.getTotalBalancePercentage(
      //     this.highestExpenseCategory().amount
      //   ),
      // },
    ];

    return cardData;
  });

  updateCategoryTotals() {
    const expenses = this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Expense');

    const totals: Record<string, number> = {};

    expenses.map(
      (el) =>
        (totals[el.category] = totals[el.category]
          ? totals[el.category] + el.amount
          : el.amount)
    );

    return totals;
  }

  getAllTransactions() {
    return this.transactionService.allTransactions();
  }

  getTotalIncome() {
    return this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Income')
      .reduce((acc, txn) => acc + txn.amount, 0);
  }

  getTotalExpenses() {
    return this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Expense')
      .reduce((acc, txn) => acc + txn.amount, 0);
  }

  getTotalBalancePercentage(value: number) {
    if (value === 0) return 0;
    return Number(((this.totalBalance() / value) * 100).toFixed(2));
  }

  fetchTotalBalanceFromStorage() {
    const data = sessionStorage.getItem('totalBalance');
    if (data) {
      return JSON.parse(data);
    } else {
      return 200000;
    }
  }
}
