import { Component, OnInit, signal, computed } from '@angular/core';
import { routerTransitions2 } from '../../../services/animation/animation';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgModel,
  FormBuilder,
  FormGroup,
  Validators,
  Form,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard/dashboard';
import { TransactionsService } from '../../../services/transactions/transactions';
import { BudgetsService } from '../../../services/budgets/budgets';
import {
  IBudgetsCategory,
  ITransactionsTableData,
} from '../../../models/interfaces';
import { KeyInsights } from '../../../components/key-insights/key-insights';
import { SummaryStatisticsComponent } from '../../../components/summary-statistics/summary-statistics';

@Component({
  selector: 'app-reports',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    KeyInsights,
    SummaryStatisticsComponent,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
  animations: [routerTransitions2],
})
export class ReportsComponent implements OnInit {
  isVisible = false;
  totalIncome = 0;
  totalBudget = 0;
  totalExpenses = 0;
  remainingBudget = 0;
  topExpense = '';
  topExpenseAmount = 0;
  topExpensePercentage = 0;
  allExpenses: ITransactionsTableData[] = [];

  currentMonth = new Date().toLocaleString('default', { month: 'long' });
  currentYear = new Date().getFullYear();
  budgetCategoryData = {};
  highestBudgetCategory = signal<{ category: string; amount: number }>({
    category: '',
    amount: 0,
  });
  totalBudgetAllocated = computed(() => {
    const budgetCategoriesObj =
      this.budgetService.getBudgetCatagoriesWithAmount();
    return Object.values(budgetCategoriesObj).reduce(
      (acc, curr) => acc + curr,
      0
    );
  });

  totalBudgetUnallocated = computed(() => {
    return this.totalBudget - this.totalBudgetAllocated();
  });

  // budgetCardData = signal<IBudgetsCategory[]>([]);
  budgetCardData = computed(() => {
    return this.budgetService.budgetCardData();
  });

  summaryForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private budgetService: BudgetsService
  ) {}
  ngOnInit(): void {
    // this.budgetCardData.set(this.budgetService.budgetCardData());

    this.allExpenses = this.transactionService
      .allTransactions()
      .filter((txn) => txn.type === 'Expense');
    this.budgetCategoryData =
      this.budgetService.getBudgetCatagoriesWithAmount();
    this.highestBudgetCategory.set(this.budgetService.highestBudgetCategory());

    // console.log({ allExpenses: this.allExpenses });
    // console.log(this.budgetService.highestBudgetCategory());
    this.totalBudget = this.dashboardService.totalBalance();
    this.totalIncome = this.dashboardService.getTotalIncome();
    this.totalExpenses = this.dashboardService.getTotalExpenses();
    this.remainingBudget = this.totalBudget - this.totalExpenses;
    this.topExpense = this.dashboardService.highestExpenseCategory().category;
    this.topExpenseAmount =
      this.dashboardService.highestExpenseCategory().amount;
    this.topExpensePercentage = this.getPerecentageOfAmountSpent(
      this.topExpenseAmount,
      this.totalExpenses
    );

    this.isVisible = true;
    this.summaryForm = this.fb.group({
      totalIncome: [
        { value: this.valueFormatter(this.totalIncome), disabled: true },
        Validators.required,
      ],
      totalBudget: [
        { value: this.valueFormatter(this.totalBudget), disabled: true },
        Validators.required,
      ],
      totalBudgetAllocated: [
        {
          value: this.valueFormatter(this.totalBudgetAllocated()),
          disabled: true,
        },
        Validators.required,
      ],
      totalBudgetUnallocated: [
        {
          value: this.valueFormatter(this.totalBudgetUnallocated()),
          disabled: true,
        },
        Validators.required,
      ],
      totalExpenses: [
        { value: this.valueFormatter(this.totalExpenses), disabled: true },
        Validators.required,
      ],
      remainingBudget: [
        { value: this.valueFormatter(this.remainingBudget), disabled: true },
        Validators.required,
      ],
    });
  }

  getOverbudgetCategories() {
    // console.log(this.budgetCardData());
    return this.budgetCardData().filter(
      (budget) =>
        budget.amountSpent > budget.amountBudgeted && budget.amountBudgeted > 0
    );
  }

  getSummarryMsg(amountSpent: number, budgetAmount: number) {
    if (budgetAmount === 0) {
      return 'You have not set a budget for this month';
    }

    if (amountSpent === 0) {
      return 'You have not spent anything this month';
    }

    if (amountSpent < budgetAmount) {
      return `Well done! You are within your budget with ${this.valueFormatter(
        budgetAmount - amountSpent
      )} remaining`;
    }

    if (amountSpent === budgetAmount) {
      return 'You have reached your budget limit';
    }

    return (
      'You have exceeded your budget with ' +
      this.valueFormatter(budgetAmount - amountSpent)
    );
  }

  getOverBudgetWarningMessage(amountSpent: number, budgetAmount: number) {
    const difference = amountSpent - budgetAmount;
    const percentage = this.getPerecentageOfAmountSpent(
      amountSpent,
      budgetAmount
    );

    if (amountSpent > budgetAmount) {
      return { difference, color: '#FF0000', percentage };
    }

    if (percentage <= 50) {
      return { difference: undefined, color: '#78C000', percentage };
    }

    if (percentage <= 80) {
      return { difference: undefined, color: '#FFA500', percentage };
    }

    return { difference: undefined, color: '#FF6467', percentage };
  }

  getPerecentageOfAmountSpent(
    amountSpent: number,
    totalAmount: number
  ): number {
    if (totalAmount === 0) return 0;

    return Number(((amountSpent / totalAmount) * 100).toFixed(1));
  }

  valueFormatter(value: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  }

  getHighestBudgetCategory() {
    if (this.highestBudgetCategory().amount === 0) {
      return null;
    }
    return this.highestBudgetCategory().category;
  }
}
