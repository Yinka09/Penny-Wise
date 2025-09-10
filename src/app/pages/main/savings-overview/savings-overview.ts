import { Component, Input, signal, OnInit, computed } from '@angular/core';
import { MainService } from '../../../services/main/main';
import { SpinnerComponent } from '../../../components/spinner/spinner';
import { ISavings } from '../../../models/interfaces';

import { routerTransitions2 } from '../../../services/animation/animation';
import { SavingsCard } from '../../../components/savings-card/savings-card';
import { FormsModule } from '@angular/forms';
import { SavingsService } from '../../../services/savings/savings-service';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-savings-overview',
  imports: [
    SpinnerComponent,
    SavingsCard,
    FormsModule,
    CurrencyPipe,
    CommonModule,
  ],
  templateUrl: './savings-overview.html',
  styleUrl: './savings-overview.scss',
  animations: [routerTransitions2],
})
export class SavingsOverviewComponent implements OnInit {
  isMasked = true;
  isVisible = false;

  progressData = {};
  isLoading = true;
  _listFilter = signal<string>('');
  get listFilter(): string {
    return this._listFilter();
  }

  set listFilter(value: string) {
    this._listFilter.set(value);
  }

  totalSavings = computed(() => {
    return this.savingsService.totalSavingsBalance();
  });

  savingsData = computed(() => {
    return this.savingsService.allSavingsData();
  });

  displaySavingsData = computed(() =>
    this._listFilter()
      ? this.performFilter(this._listFilter())
      : this.savingsData()
  );

  showAddSavingsModal: boolean = false;

  selectedSavings: ISavings | undefined;

  public options: any;

  isEditMode = signal<boolean>(true);
  isCreateMode = signal<boolean>(true);
  isViewMode = signal<boolean>(false);
  constructor(
    private mainService: MainService,
    private savingsService: SavingsService
  ) {}
  ngOnInit(): void {
    this.isVisible = true;
    this.mainService.headerTitle.set('Savings Overview');
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
      animationDuration: 2500,
    };
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
    // const totalExpenses = this.dashboardService.getTotalExpenses();

    // const perecentageBalance = Number(
    //   ((totalExpenses / this.totalBalance()) * 100).toFixed(1)
    // );
    // return perecentageBalance;
    return 1;
  }

  performFilter(filterBy: string): ISavings[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.savingsData().filter(
      (el: ISavings) => el.title.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }
  onDeleteAllBudgets(event: any) {
    // this.confirmationService.confirm({
    //   target: event.target as EventTarget,
    //   message: 'Are you sure you want to delete all budgets?',
    //   header: 'Confirm Delete',
    //   icon: 'pi pi-info-circle',
    //   acceptButtonStyleClass: 'p-button-danger   ',
    //   rejectButtonStyleClass: 'p-button-secondary',
    //   acceptIcon: 'none',
    //   rejectIcon: 'none',
    //   accept: () => {
    //     this.budgetService.deleteAllBudgets();
    //     this.getChartOptions(10);
    //     this.getProgressData();
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Budgets Deleted Successfully',
    //       life: 3000,
    //     });
    //   },
    //   reject: () => {
    //     this.messageService.add({
    //       severity: 'info',
    //       summary: 'Cancelled',
    //       detail: 'Delete action cancelled',
    //     });
    //   },
    // });
  }

  toggleVisibility() {
    this.isMasked = !this.isMasked;
  }

  valueFormatter(value: number) {
    return this.isMasked
      ? '*****'
      : new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }).format(value);
  }
}
