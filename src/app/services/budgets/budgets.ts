import { Injectable, computed, signal } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard';
import { TransactionsService } from '../transactions/transactions';
import { IBudgetsCategory } from '../../models/interfaces';
import { BudgetCategoryData } from '../../models/mock-data';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  public budgetCategories = signal<IBudgetsCategory[]>(BudgetCategoryData);
  public allBudgetCategories = this.budgetCategories.asReadonly();
  budgetCardData = computed<IBudgetsCategory[]>(() => {
    const budCategory = this.budgetCategories();
    return budCategory.map((expense) => {
      const expenses = this.getExpenses().filter(
        (el) => el.category === expense.budgetCategory
      );
      const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      return {
        ...expense,
        amountSpent: totalSpent,
      };
    });
  });
  // budgetCardData: IBudgetsCategory[] = [];
  //  budgetCardData = computed(() => this.budgetCategories());
  constructor(
    private transactionService: TransactionsService,
    private dashBoardService: DashboardService
  ) {}

  getExpenses() {
    return this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Expense');
  }

  getBudgetCatagoriesWithAmount() {
    let categoriesObj: { [key: string]: number } = {};
    // let categoriesObj: { category: string, amount: number } = {};
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
    console.log({ formData });
    console.log(this.budgetCategories());
    this.budgetCategories.update((prevTrans: IBudgetsCategory[]) => {
      return prevTrans.map((el) =>
        el.budgetCategory === formData?.budgetCategory
          ? { ...el, amountBudgeted: formData.amountBudgeted }
          : el
      );
    });
  }
  // addBudget(budget: IBudgetsCategory) {
  //   this.budgetCategories.update((prevTrans) => {
  //     return [budget, ...prevTrans];
  //   });
  // }

  updateBudget(budget: IBudgetsCategory | undefined, updatedVal: any) {
    console.log(this.budgetCategories());
    this.budgetCategories.update((prevTrans: IBudgetsCategory[]) => {
      return prevTrans.map((el) =>
        el.budgetCategory === budget?.budgetCategory
          ? { ...el, ...updatedVal }
          : el
      );
    });
  }

  deleteBudget(id: number) {
    this.budgetCategories.update((prevTrans: IBudgetsCategory[]) =>
      prevTrans.filter((el: IBudgetsCategory) => el.id !== id)
    );
  }
}
