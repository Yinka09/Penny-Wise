import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { CircleProgressModule } from '../../../components/circle-progress/circle-progress.module';
import {
  routerTransitions,
  routerTransitions2,
} from '../../../services/animation/animation';
import { DashboardService } from '../../../services/dashboard/dashboard';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { BudgetsService } from '../../../services/budgets/budgets';
import { BudgetCategoryCard } from '../../../components/budget-category-card/budget-category-card';
import { IBudgetsCategory } from '../../../models/interfaces';
import { TransactionsService } from '../../../services/transactions/transactions';
import { FormsModule } from '@angular/forms';
import { AgCharts } from 'ag-charts-angular';

import { AddBudget } from '../../../components/modals/add-budget/add-budget';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { SpinnerComponent } from '../../../components/spinner/spinner';

@Component({
  standalone: true,
  selector: 'app-budgets',
  imports: [
    CircleProgressModule,
    CurrencyPipe,
    CommonModule,
    ProgressBarModule,
    BudgetCategoryCard,
    FormsModule,
    AgCharts,
    AddBudget,
    ConfirmDialogModule,

    SpinnerComponent,
  ],
  templateUrl: './budgets.html',
  styleUrls: ['./budgets.scss'],
  animations: [routerTransitions, routerTransitions2],
  providers: [MessageService, ConfirmationService],
})
export class BudgetsComponent implements OnInit, OnDestroy {
  isVisible = false;
  progressData = {};
  totalBalance = computed(() => {
    return this.dashboardService.totalBalance();
  });
  totalExpenses = computed(() => {
    return this.dashboardService.getTotalExpenses();
  });

  budgetCards: { id: number; icon: string; amount: number; label: string }[] =
    [];
  budgetCategoryData = computed(() => {
    return this.budgetService.budgetCardData();
  });

  displayBudgetCategoryData = computed(() =>
    this._listFilter()
      ? this.performFilter(this._listFilter())
      : this.budgetCategoryData()
  );

  _listFilter = signal<string>(''); // make filter reactive

  showAddBudgetModal: boolean = false;

  selectedBudget: IBudgetsCategory | undefined;

  isEditMode = signal<boolean>(true);
  isCreateMode = signal<boolean>(true);
  isViewMode = signal<boolean>(false);
  displayUpdateTotalBudgetModal = signal<boolean>(false);
  // _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter();
  }

  set listFilter(value: string) {
    this._listFilter.set(value);
  }
  isLoading = true;

  public options: any;
  constructor(
    private dashboardService: DashboardService,
    private budgetService: BudgetsService,
    private transactionService: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const budgetCategoryData = this.budgetService.budgetCardData();
    // console.log({ budgetCategoryData });
    this.isVisible = true;

    this.updateBudgetCards();
    this.getChartOptions(30);
    this.getProgressData();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  getProgressData() {
    this.progressData = {
      percent: this.getExpensesPercentage(),
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: this.getStrokeColor(),
      innerStrokeColor: this.getStrokeColor(),
      animation: true,
      animationDuration: 300,
    };
  }

  private getChartOptions(radius: number) {
    this.options = {
      data: this.getBudgetChartData(),
      title: {
        text: 'Budget Composition',
      },
      series: [
        {
          type: 'pie',
          angleKey: 'amount',
          calloutLabelKey: 'category',
          sectorLabelKey: 'amount',
          outerRadiusOffset: radius,
          sectorLabel: {
            color: 'white',
            fontWeight: 'bold',
            formatter: ({ value }: any) => `₦${(value / 1000).toFixed(0)}K`,
          },
        },
      ],
    };
  }

  private updateBudgetCards() {
    this.budgetCards = [
      {
        id: 1,
        icon: 'fa-money-bill-wave',
        amount: this.totalBalance(),
        label: 'Total Budget',
      },
      {
        id: 2,
        icon: 'fa-money-bill-transfer',
        amount: this.totalExpenses(),
        label: 'Total Expenses',
      },
      {
        id: 3,
        icon: 'fa-piggy-bank',
        amount:
          this.totalExpenses() > this.totalBalance()
            ? 0
            : this.totalBalance() - this.totalExpenses(),
        label: 'Remaining Budget',
      },
    ];
  }

  resetAllBudgets() {
    this.budgetService.updateAllBudgets(0);
    this.getChartOptions(10);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Budgets successfully reset',
      life: 3000,
    });
  }

  getBudgetChartData() {
    const categoriesObj = this.budgetService.getBudgetChartData();
    const totalCategoryBudgeted = Object.values(categoriesObj).reduce(
      (acc, cur) => acc + cur.amount,
      0
    );

    const totalAmountBudgeted = this.dashboardService.totalBalance();

    if (totalAmountBudgeted > totalCategoryBudgeted) {
      // console.log('I have excesses');
      return [
        ...categoriesObj,

        {
          category: 'Unbudgeted',
          amount: totalAmountBudgeted - totalCategoryBudgeted,
        },
      ];
    }
    return categoriesObj;
  }

  getBudgetAmountSpent(category: string) {
    const allExpenses = this.transactionService
      .allTransactions()
      .filter((el) => el.type === 'Expense' && el.category === category);

    const totalCategorySpent = allExpenses.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );

    return totalCategorySpent;
  }

  getOverBudgetWarningMessage(amountSpent: number, budgetAmount: number) {
    const difference = amountSpent - budgetAmount;
    const percentage = this.getPerecentageOfBudgetSpent(
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

  getStrokeColor(): string {
    const percentageSpent = this.getExpensesPercentage();

    switch (true) {
      case percentageSpent <= 50:
        return '#78C000';
      case percentageSpent <= 80:
        return '#FFA500';
      case percentageSpent > 80:
        return '#FF0000';
      default:
        return '#78C000';
    }
  }

  getExpensesPercentage(): number {
    const totalExpenses = this.dashboardService.getTotalExpenses();

    const perecentageBalance = Number(
      ((totalExpenses / this.totalBalance()) * 100).toFixed(1)
    );
    return perecentageBalance;
  }

  getPerecentageOfBudgetSpent(
    amountSpent: number,
    budgetAmount: number
  ): number {
    if (budgetAmount === 0) return 0;

    return Number(((amountSpent / budgetAmount) * 100).toFixed(1));
  }

  getTotalBalancePercentage(amount: number): number {
    if (this.totalBalance() === 0) {
      return 0;
    }
    return Number(((amount / this.totalBalance()) * 100).toFixed(1));
  }

  getCardTextColor(item: {
    id: number;
    icon: string;
    amount: number;
    label: string;
  }): string {
    const totalExpenses = this.dashboardService.getTotalExpenses();
    const remainingBalance = this.totalBalance() - totalExpenses;
    if (item.label === 'Total Budget') {
      return 'purple';
    } else if (item.label === 'Total Expenses') {
      return 'Red';
    } else {
      if (item.amount === 0) {
        return 'gray';
      } else {
        return this.getStrokeColor();
      }
    }
  }

  performFilter(filterBy: string): IBudgetsCategory[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.budgetCategoryData().filter(
      (el: IBudgetsCategory) =>
        el.budgetCategory.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  showAddBudgetDialog() {
    this.showAddBudgetModal = true;
    this.selectedBudget = undefined;
    this.displayUpdateTotalBudgetModal.set(false);
    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(true);
  }
  showUpdateTotalBudgetDialog() {
    this.showAddBudgetModal = true;
    this.selectedBudget = undefined;

    this.displayUpdateTotalBudgetModal.set(true);
    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(true);
  }

  onAddBudget(event: IBudgetsCategory) {
    const formData = { ...event };

    this.isCreateMode.set(true);
    this.isEditMode.set(false);

    if (this.isCreateMode()) {
      const formData = { ...event };
      if (this.displayUpdateTotalBudgetModal()) {
        // this.dashboardService.totalBalance.set(formData.amountBudgeted);
        this.budgetService.updateTotalBudgetAmount(formData.amountBudgeted);

        this.updateBudgetCards();

        this.getProgressData();
        this.resetAllBudgets();
        this.displayUpdateTotalBudgetModal.set(false);
      } else {
        console.log('I am not updating total budget only');
        this.budgetService.addBudget(formData);
        this.getChartOptions(30);
        this.getProgressData();
      }
    } else {
      this.budgetService.updateBudget(this.selectedBudget, formData);
      this.getChartOptions(30);
      this.getProgressData();
    }

  }

  onViewTransaction(data: IBudgetsCategory) {
    // console.log('On View', data);

    this.showAddBudgetModal = true;

    this.selectedBudget = data;
    this.isEditMode.set(false);
    this.isViewMode.set(true);
    this.isCreateMode.set(false);
  }

  onEditBudget(data: IBudgetsCategory) {
    // console.log('On Edit', data);
    this.showAddBudgetModal = true;

    this.selectedBudget = data;
    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(false);
  }

  onDeleteBudget(data: IBudgetsCategory, event: any) {
    console.log('On Delete', data);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this budget?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
       
        this.budgetService.deleteBudget(data.id);
        this.getChartOptions(30);
        this.getProgressData();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Budget Deleted Successfully',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Delete action cancelled',
        });
      },
    });
  }

  onDeleteAllBudgets(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete all budgets?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        
        this.budgetService.deleteAllBudgets();
        this.getChartOptions(10);
        this.getProgressData();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Budgets Deleted Successfully',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Delete action cancelled',
        });
      },
    });
  }
  ngOnDestroy(): void {}
}
