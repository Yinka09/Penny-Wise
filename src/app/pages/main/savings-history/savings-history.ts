import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { MainService } from '../../../services/main/main';
import { ToastModule } from 'primeng/toast';
import {
  Subject,
  takeUntil,
  Subscription,
  tap,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
  ITransactionsTableData,
  type ISavingsTableData,
} from '../../../models/interfaces';
import { TransactionsMockTableData } from '../../../models/mock-data';

import { AgGridAngular } from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  DateFilterModule,
  RowStyleModule,
  CellStyleModule,
  NumberFilterModule,
  PaginationNumberFormatterParams,
  FirstDataRenderedEvent,
  PaginationModule,
} from 'ag-grid-community';
ModuleRegistry.registerModules([
  RowStyleModule,
  CellStyleModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  DateFilterModule,
]);
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// ModuleRegistry.registerModules([ClientSideRowModelModule, PaginationModule]);

import { Router } from '@angular/router';
import { ActionMenuRendererComponent } from '../../../components/action-menu-renderer/action-menu-renderer.component';
import { AddTransactionComponent } from '../../../components/modals/add-transaction/add-transaction';
import { TransactionsService } from '../../../services/transactions/transactions';
import { ChangeDetectorRef } from '@angular/core';
import {
  routerTransitions,
  routerTransitions2,
} from '../../../services/animation/animation';
import { SpinnerComponent } from '../../../components/spinner/spinner';
import { SavingsService } from '../../../services/savings/savings-service';
import { AddSavingsHistory } from '../../../components/modals/add-savings-history/add-savings-history';

@Component({
  selector: 'app-savings-history',
  imports: [
    ToastModule,
    CommonModule,
    AgGridAngular,
    AddTransactionComponent,
    ConfirmDialogModule,
    ToastModule,
    SpinnerComponent,
    AddSavingsHistory,
  ],
  templateUrl: './savings-history.html',
  styleUrl: './savings-history.scss',
  providers: [MessageService, ConfirmationService],
  animations: [routerTransitions, routerTransitions2],
})
export class SavingsHistoryComponent implements OnInit {
  tabHeaders = [
    {
      label: 'All Savings',
      value: 'All',
    },
    {
      label: 'Deposits',
      value: 'Deposit',
    },
    {
      label: 'Withdrawals',
      value: 'Withdrawal',
    },
  ];

  isVisible = false;

  showAddSavingsModal: boolean = false;
  selectedTab = signal<string>('All');

  isShowSpinner: boolean = true;

  isTableDataComplete: boolean = false;
  selectedSavings: ISavingsTableData | undefined;

  isEditMode = signal<boolean>(true);
  isCreateMode = signal<boolean>(true);
  isViewMode = signal<boolean>(false);

  displayTableData = computed(() =>
    this.savingsService
      .savingsTableData()
      .filter(
        (el: ISavingsTableData) =>
          this.selectedTab() === 'All' || el.type === this.selectedTab()
      )
  );
  // transactionTableDetails: ITransactionsTableData[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
    sortable: true,
  };

  rowClass = 'ag-grid-table ';
  columnDefs: ColDef[] = [
    {
      headerName: 'DATE',
      field: 'date',
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-CA').replace(/-/g, '/');
      },
    },
    {
      headerName: 'DESCRIPTION',
      field: 'description',
      filter: true,
    },
    {
      headerName: 'CATEGORY',
      // field: 'savingCategory',
      valueGetter: (params) =>
        this.savingsService.getSavingsCategoryName(
          params.data.savingCategoryId
        ),
      filter: 'agTextColumnFilter',
      cellStyle: {
        fontWeight: '600',
      },
    },

    {
      headerName: 'GOAL',
      valueGetter: (params) =>
        this.savingsService.getSavingsGoalTitle(params.data.savingsId),

      filter: true,
      cellStyle: {
        fontWeight: '600',
      },
    },
    {
      headerName: 'AMOUNT (₦)',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      cellStyle: (params) => {
        return {
          color: params.data.type === 'Withdrawal' ? 'red' : 'green',
          fontWeight: 600,
        };
      },
      valueFormatter: (params) => {
        if (params.value == null) return '';

        const formatted = new Intl.NumberFormat('en-NG', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);

        return params.data.type === 'Withdrawal'
          ? `-₦${formatted}`
          : `+₦${formatted}`;
      },
    },
    {
      headerName: 'TYPE',
      field: 'type',
      filter: true,

      cellRenderer: (params: any) => {
        const statusClass =
          params.value === 'Deposit' ? 'bg-active' : 'bg-inactive';
        const statusIcon =
          params.value === 'Deposit'
            ? 'fa-hand-holding-dollar'
            : 'fa-money-bill-transfer';

        return `<span class="span-class ${statusClass}"><i class="fa-solid ${statusIcon}"></i>${params.value}</span>`;
      },
      // width: 500,
      // flex: 0,
    },

    {
      headerName: 'ACTION',
      field: 'action',
      filter: false,
      sortable: false,
      cellRenderer: ActionMenuRendererComponent,
      width: 120,

      flex: 0,
    },
  ];

  rowHeight = 70;

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [2, 5, 8, 10, 15, 20];
  tableStyle = 'height: 100%; margin: 10px auto 0 auto; width: 100%;';
  currentUrl = '';
  isLoading = true;
  constructor(
    private router: Router,
    private mainService: MainService,
    private transactionsService: TransactionsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private savingsService: SavingsService
  ) {}

  ngOnInit(): void {
    this.isVisible = true;
    this.currentUrl = this.router.url;

    console.log('this is:', this.savingsService.calculateTotalDeposits());

    this.mainService.headerTitle.set('Savings History');
    this.mainService.setIsTransactionPage(true);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onTabChange(tab: { label: string; value: string }) {
    this.selectedTab.set(tab.value);
  }

  getSavingsTableData(params: GridReadyEvent<ISavingsTableData[]>) {
    this.isTableDataComplete = true;
    this.showSpinner();
  }

  showSpinner() {
    if (this.isTableDataComplete) {
      this.isShowSpinner = false;
    }
  }

  showAddHistoryDialog() {
    this.showAddSavingsModal = true;
    this.selectedSavings = undefined;

    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(true);
  }

  onActionSelectChange(event: any) {
    // console.log('Action Event', event.target.value);
    const action = event.target.value;
    if (action === '1') {
      console.log('Action Event', event.target.value);
      this.showAddHistoryDialog();
    } else if (action === '2') {
      this.deleteAllSavingsHistory(event);
    } else {
      return;
    }

    event.target.value = '0';
  }

  onAddTransaction(event: ISavingsTableData) {
    const formData = { ...event };
    if (this.isCreateMode()) {
      this.savingsService.addToSavingsTable(formData);
    } else {
      this.savingsService.updateSavingsTableItem(
        this.selectedSavings?.id,
        formData
      );
    }

    this.isEditMode.set(true);
    // console.log('Received form', event);
  }

  onViewTransaction(data: ISavingsTableData) {
    // console.log('On View', data);

    this.showAddSavingsModal = true;

    this.selectedSavings = data;
    this.isEditMode.set(false);
    this.isViewMode.set(true);
    this.isCreateMode.set(false);
  }

  onEditTransaction(data: ISavingsTableData) {
    // console.log('On Edit', data);
    this.showAddSavingsModal = true;

    this.selectedSavings = data;
    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(false);
  }

  onUpdateTransactionType(
    data: ISavingsTableData,
    event: any,
    type: 'Deposit' | 'Withdrawal'
  ) {
    // console.log('On Add to Income', data);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to add history to ${type.toLocaleLowerCase()}?`,
      header: `Add to ${type}`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.savingsService.updateHistoryType(data, type);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Added to ${type} Successfully`,
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Action cancelled',
        });
      },
    });
  }

  onDeleteTransaction(data: ISavingsTableData, event: any) {
    console.log('On Delete', data);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this history?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.savingsService.deleteSavingsTableItem(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'History Deleted Successfully',
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
  currentUrlIsTransaction() {
    return this.currentUrl === '/main/transactions';
  }

  paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.paginationGoToPage(0);
  }

  deleteAllSavingsHistory(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete all Savings History?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.savingsService.resetSavingsTable();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'History Deleted Successfully',
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
}
