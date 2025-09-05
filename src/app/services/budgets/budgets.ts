import { Injectable, computed, signal } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard';
import { TransactionsService } from '../transactions/transactions';
import { IBudgetsCategory } from '../../models/interfaces';
import { BudgetCategoryData } from '../../models/mock-data';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  public budgetCategories = signal<IBudgetsCategory[]>(
    this.fetchBudgetsFromStorageData()
  );
  public allBudgetCategories = this.budgetCategories.asReadonly();
  budgetCardData = computed<IBudgetsCategory[]>(() => {
    const budCategory = this.budgetCategories();
    return budCategory.map((budget) => {
      const expenses = this.getExpenses().filter(
        (el) => el.category === budget.budgetCategory
      );
      const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      return {
        ...budget,
        amountSpent: totalSpent,
      };
    });
  });

  highestBudgetCategory = computed(() => {
    const allBudget = this.getBudgetCatagoriesWithAmount();

    let maxCategory = '';
    let maxAmount = 0;

    for (const [category, amount] of Object.entries(allBudget)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategory = category;
      }
    }

    return { category: maxCategory, amount: maxAmount };
  });

  constructor(
    private transactionService: TransactionsService,
    private dashboardService: DashboardService
  ) {}

  getExpenses() {
    return this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Expense');
  }

  getBudgetCatagoriesWithAmount() {
    let categoriesObj: { [key: string]: number } = {};
    this.budgetCategories().map((el) => {
      categoriesObj[el.budgetCategory] = el.amountBudgeted;
    });
    return categoriesObj;
  }

  getBudgetChartData() {
    const categoriesObj = this.getBudgetCatagoriesWithAmount();
    return Object.entries(categoriesObj).map(([key, value]) => {
      return { category: key, amount: value };
    });
  }

  getLastItemId(arr: any) {
    return arr.length ? arr[arr.length - 1].id : 0;
  }

  addBudget(formData: any) {
    // console.log({ formData });
    // console.log(this.budgetCategories());
    this.budgetCategories.update((prevTrans: IBudgetsCategory[]) => {
      const updated = prevTrans.map((el) =>
        el.budgetCategory === formData?.budgetCategory
          ? { ...el, amountBudgeted: formData.amountBudgeted }
          : el
      );
      sessionStorage.setItem('budgetData', JSON.stringify(updated));
      return updated;
    });
  }

  updateAllBudgets(updatedVal: number) {
    this.budgetCategories.update((prevBudget: IBudgetsCategory[]) => {
      const updated = prevBudget.map((el) => ({
        ...el,
        amountBudgeted: updatedVal,
      }));
      sessionStorage.setItem('budgetData', JSON.stringify(updated));
      return updated;
    });
  }

  updateBudget(budget: IBudgetsCategory | undefined, updatedVal: any) {
    // console.log(this.budgetCategories());
    this.budgetCategories.update((prevTrans: IBudgetsCategory[]) => {
      const updated = prevTrans.map((el) =>
        el.budgetCategory === budget?.budgetCategory
          ? { ...el, ...updatedVal }
          : el
      );
      sessionStorage.setItem('budgetData', JSON.stringify(updated));
      return updated;
    });
  }

  deleteBudget(id: number) {
    this.budgetCategories.update((prevTrans: IBudgetsCategory[]) => {
      const updated = prevTrans.filter((el: IBudgetsCategory) => el.id !== id);
      sessionStorage.setItem('budgetData', JSON.stringify(updated));
      return updated;
    });
  }

  deleteAllBudgets() {
    this.budgetCategories.set([]);
    sessionStorage.setItem('budgetData', JSON.stringify([]));
  }

  updateTotalBudgetAmount(updatedVal: number) {
    this.dashboardService.totalBalance.set(updatedVal);
    sessionStorage.setItem('budgetData', JSON.stringify([]));
  }

  fetchBudgetsFromStorageData() {
    const data = sessionStorage.getItem('budgetData');
    if (data) {
      return JSON.parse(data);
    } else {
      return BudgetCategoryData;
    }
  }
}
