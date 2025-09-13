import { Component, Input, signal, OnInit, computed } from '@angular/core';
import { MainService } from '../../../services/main/main';
import { SpinnerComponent } from '../../../components/spinner/spinner';
import { ISavings } from '../../../models/interfaces';

import { routerTransitions2 } from '../../../services/animation/animation';
import { SavingsCard } from '../../../components/savings-card/savings-card';
import { FormsModule } from '@angular/forms';
import { SavingsService } from '../../../services/savings/savings-service';
import { CommonModule } from '@angular/common';
import { AddSavings } from '../../../components/modals/add-savings/add-savings';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AgCharts } from 'ag-charts-angular';

type MaskedKeys =
  | 'Total Budget'
  | 'Total Targeted Savings'
  | 'Total Expenses'
  | 'Total Savings'
  | string;

interface IsavingsCard {
  id: number;
  title: string;
  value: number;
  description: string;
  isMasked: boolean;
}

@Component({
  selector: 'app-savings-overview',
  imports: [
    SpinnerComponent,
    SavingsCard,
    FormsModule,
    CommonModule,
    AddSavings,
    ConfirmDialogModule,
    ToastModule,
    AgCharts,
  ],
  templateUrl: './savings-overview.html',
  styleUrl: './savings-overview.scss',
  animations: [routerTransitions2],
  providers: [MessageService, ConfirmationService],
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

  totalTargetedSavings = computed(() => {
    return this.savingsService.getAllTargetedSavingsAmount();
  });

  totalSavings = computed(() => {
    return this.savingsService.totalSavingsBalance();
  });

  savingsData = computed(() => {
    return this.savingsService.allSavingsData();
  });

  displaySavingsData = computed(() =>
    this._listFilter()
      ? this.performFilter(this._listFilter())
      : this.savingsService.getAllSavingsWithSavedAmount()
  );

  showAddSavingsModal: boolean = false;

  selectedSavings: ISavings | undefined;

  public options: any;

  donutChartConfig: any;
  lineChartConfig: any;

  isEditMode = signal<boolean>(false);
  isCreateMode = signal<boolean>(true);
  isViewMode = signal<boolean>(false);

  displayUpdateTotalSavingsModal = signal<boolean>(false);

  savingsCardArr = computed(() => [
    {
      id: 1,
      title: 'Total Savings',
      value: this.totalSavings(),
      description: 'Across all active goals',
      isMasked: true,
    },
    {
      id: 2,
      title: 'Total Targeted Savings',
      value: this.totalTargetedSavings(),
      description: 'Across all active saving goals',
      isMasked: true,
    },
  ]);
  constructor(
    private mainService: MainService,
    private savingsService: SavingsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    // console.log(
    //   'This is total',
    //   this.savingsService.getAllTargetedSavingsAmount()
    // );
    this.isVisible = true;
    this.mainService.headerTitle.set('Savings Overview');
    // this.getProgressData();
    // this.getChartOptions(30);
    this.setDonutChartConfig();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  setDonutChartConfig() {
    this.donutChartConfig = this.savingsService.getDonutChartConfig();
    this.lineChartConfig = this.savingsService.getLineChartConfig();
    // this.barChartConfig = this.reportsService.getBarChartConfig();
    // this.lineChartConfig = this.reportsService.getLineChartConfig();
  }

  showAddSavingsDialog() {
    this.showAddSavingsModal = true;
    this.selectedSavings = undefined;
    this.displayUpdateTotalSavingsModal.set(false);
    // this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(true);
  }
  performFilter(filterBy: string): ISavings[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.savingsData().filter(
      (el: ISavings) => el.title.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  onAddSavings(event: ISavings) {
    const formData = { ...event };

    // this.isCreateMode.set(true);
    // this.isEditMode.set(false);

    if (this.isCreateMode() && !this.isEditMode()) {
      const formData = { ...event };

      // console.log('I am creating');
      // console.log('i am edit mode', this.isCreateMode());
      this.savingsService.addToSavings(formData);
      // this.getChartOptions(30);
      // this.getProgressData();
    } else {
      // console.log('I am edting');
      this.savingsService.updateSavingsItem(this.selectedSavings, formData);
      // this.getChartOptions(30);
      // this.getProgressData();
    }
    this.setDonutChartConfig();
  }

  onEditSavings(data: ISavings) {
    // console.log('On Edit', data);
    this.showAddSavingsModal = true;

    this.selectedSavings = data;
    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(false);
  }

  onDeleteSavings(data: ISavings, event: any) {
    console.log('On Delete', data);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this goal?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        // this.getChartOptions(30);
        // this.getProgressData();
        this.savingsService.deleteSavingsItem(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Goal Deleted Successfully',
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
  onDeleteAllSavings(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete all saving goals?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.savingsService.resetAllSavings();
        // this.getChartOptions(10);
        // this.getProgressData();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Goals Deleted Successfully',
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

  toggleVisibility(card: IsavingsCard) {
    card.isMasked = !card.isMasked;
  }

  valueFormatter(card: IsavingsCard) {
    return card.isMasked
      ? '*****'
      : new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }).format(card.value);
  }
}
