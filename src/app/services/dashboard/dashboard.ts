import { computed, effect, Injectable, signal } from '@angular/core';
import { TransactionsService } from '../transactions/transactions';
import { ICardData } from '../../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  cardData: ICardData[] = [];
  totalBalance = signal<number>(12000000);
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
    // const totals = this.categoryTotals();
    // console.log({ totals });

    let maxCategory = '';
    let maxAmount = 0;

    for (const [category, amount] of Object.entries(totals)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategory = category;
      }
    }
    // console.log('this is', { maxCategory, maxAmount });

    return { category: maxCategory, amount: maxAmount };
  });

  // highestExpenseTransaction = computed(() => {
  //   const expenses = this.transactionService
  //     .allTransactions()
  //     .filter((txn) => txn.type === 'Expense');

  //   if (expenses.length === 0) {
  //     return null;
  //   }

  //   return expenses.reduce((max, txn) => (txn.amount > max.amount ? txn : max));
  // });

  // highestExpenseCategory = computed(() =>
  //   this.highestExpenseTransaction()
  //     ? this.highestExpenseTransaction()!.category
  //     : null
  // );

  // highestExpenseAmount = computed(() =>
  //   this.highestExpenseTransaction()
  //     ? this.highestExpenseTransaction()!.amount
  //     : null
  // );

  constructor(private transactionService: TransactionsService) {}

  createDashboardCards = computed(() => {
    const cardData = [
      {
        title: 'Total Balance',
        amount: this.totalBalance(),
        description: 'Total balance for',
        icon: 'fa-piggy-bank',
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
        title: 'Top Category',
        amount: this.highestExpenseCategory().amount,
        description: this.highestExpenseCategory().category + ' expenses for',
        icon: 'fa-money-bill-trend-up',
        iconBg: '#E113131A',
        percentage: this.getTotalBalancePercentage(
          this.highestExpenseCategory().amount
        ),
      },
    ];

    return cardData;
  });

  updateCategoryTotals() {
    const expenses = this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Expense');

    const totals: Record<string, number> = {};
    // for (const txn of expenses) {
    //   if (!totals[txn.category]) {
    //     totals[txn.category] = 0;
    //   }
    //   totals[txn.category] += txn.amount;
    // }

    expenses.map(
      (el) =>
        (totals[el.category] = totals[el.category]
          ? totals[el.category] + el.amount
          : el.amount)
    );
    // this.categoryTotals.set(totals);
    // console.log({ totals });
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
}
