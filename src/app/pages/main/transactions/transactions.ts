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
import { ITransactionsTableData } from '../../../models/interfaces';
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

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [
    ToastModule,
    CommonModule,
    AgGridAngular,
    AddTransactionComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  providers: [MessageService, ConfirmationService],
  animations: [routerTransitions, routerTransitions2],
})
export class TransactionsComponent implements OnInit {
  tabHeaders = [
    {
      label: 'All Transactions',
      value: 'All',
    },
    {
      label: 'Income',
      value: 'Income',
    },
    {
      label: 'Expenses',
      value: 'Expense',
    },
  ];

  isVisible = false;

  showAddTransactionModal: boolean = false;
  selectedTab = signal<string>('All');

  // selectedTab = 'All';

  isShowSpinner: boolean = true;

  isTableDataComplete: boolean = false;
  selectedTransaction: ITransactionsTableData | undefined;

  isEditMode = signal<boolean>(true);
  isCreateMode = signal<boolean>(true);
  isViewMode = signal<boolean>(false);
  displayTableData = computed(() =>
    this.transactionsService
      .allTransactions()
      .filter(
        (el: ITransactionsTableData) =>
          this.selectedTab() === 'All' || el.type === this.selectedTab()
      )
  );
  transactionTableDetails: ITransactionsTableData[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
  };

  rowClass = 'ag-grid-table ';
  columnDefs: ColDef[] = [
    {
      headerName: 'DATE',
      field: 'date',
      filter: 'agDateColumnFilter',
      // filter: true,
      // width: 200,
    },
    {
      headerName: 'DESCRIPTION',
      field: 'description',
      filter: true,
      cellStyle: {
        fontWeight: '600',
        // textDecoration: 'underline',
      },
      // flex: 1,
    },
    {
      headerName: 'CATEGORY',
      field: 'category',
      filter: 'agTextColumnFilter',
      // filter: true,
      // flex: 1,
      // width: 200,
    },
    {
      headerName: 'AMOUNT (₦)',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      cellStyle: (params) => {
        return {
          color: params.data.type === 'Expense' ? 'red' : 'green',
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

        return params.data.type === 'Expense'
          ? `-₦${formatted}`
          : `+₦${formatted}`;
      },
    },
    {
      headerName: 'PAYMENT METHOD',
      field: 'paymentMethod',
      // filter: 'agTextColumnFilter',
      filter: true,
      // flex: 1,
      // width: 200,
    },
    {
      headerName: 'TYPE',
      field: 'type',
      filter: true,

      cellRenderer: (params: any) => {
        const statusClass =
          params.value === 'Income' ? 'bg-active' : 'bg-inactive';
        const statusIcon =
          params.value === 'Income'
            ? 'fa-hand-holding-dollar'
            : 'fa-money-bill-transfer';
        // const statusIcon = params.value === 'whitelist' ? 'bi-check' : 'bi-x';

        return `<span class="span-class ${statusClass}"><i class="fa-solid ${statusIcon}"></i>${params.value}</span>`;
        // return `<span class="span-class ${statusClass}"><i class="bi ${statusIcon} me-2"></i>${params.value}</span>`;
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
  constructor(
    private router: Router,
    private mainService: MainService,
    private transactionsService: TransactionsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.isVisible = true;
    this.currentUrl = this.router.url;
    // this.mainService.setHeaderTitle('Transactions');
    this.mainService.headerTitle.set('Transactions');
    this.mainService.setIsTransactionPage(true);
  }

  onTabChange(tab: { label: string; value: string }) {
    this.selectedTab.set(tab.value);
  }

  getTransactionTableData(params: GridReadyEvent<ITransactionsTableData>) {
    this.isTableDataComplete = true;
    this.showSpinner();
  }

  showSpinner() {
    if (this.isTableDataComplete) {
      this.isShowSpinner = false;
    }
  }
  showAddTransactionDialog() {
    this.showAddTransactionModal = true;
    this.selectedTransaction = undefined;

    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(true);
  }

  onAddTransaction(event: ITransactionsTableData) {
    const formData = { ...event };
    if (this.isCreateMode()) {
      this.transactionsService.addTransaction(formData);
    } else {
      this.transactionsService.updateTransaction(
        this.selectedTransaction?.transactionId,
        formData
      );
    }

    this.isEditMode.set(true);
    // console.log('Received form', event);
  }

  onViewTransaction(data: ITransactionsTableData) {
    // console.log('On View', data);

    this.showAddTransactionModal = true;

    this.selectedTransaction = data;
    this.isEditMode.set(false);
    this.isViewMode.set(true);
    this.isCreateMode.set(false);
  }

  onEditTransaction(data: ITransactionsTableData) {
    // console.log('On Edit', data);
    this.showAddTransactionModal = true;

    this.selectedTransaction = data;
    this.isEditMode.set(true);
    this.isViewMode.set(false);
    this.isCreateMode.set(false);
  }
  onAddTransactionToExpense(data: ITransactionsTableData, event: any) {
    console.log('On Add To Expense', data);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to add transaction to expense?',
      header: 'Add to Expense',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        // this.messageService.add({
        //   severity: 'info',
        //   summary: 'Confirmed',
        //   detail: 'Transaction deleted',
        // });
        this.transactionsService.addTransactionToExpense(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: ' Added to Expense Successfully',
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
  onAddTransactionToIncome(data: ITransactionsTableData, event: any) {
    console.log('On Add to Income', data);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to add transaction to income?',
      header: 'Add to Income',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        // this.messageService.add({
        //   severity: 'info',
        //   summary: 'Confirmed',
        //   detail: 'Transaction deleted',
        // });
        this.transactionsService.addTransactionToIncome(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: ' Added to Income Successfully',
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

  onDeleteTransaction(data: ITransactionsTableData, event: any) {
    console.log('On Delete', data);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this transaction?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger   ',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        // this.messageService.add({
        //   severity: 'info',
        //   summary: 'Confirmed',
        //   detail: 'Transaction deleted',
        // });
        this.transactionsService.deleteTransaction(data.transactionId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Transaction Deleted Successfully',
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
    // params.api.paginationGoToPage(4);
    params.api.paginationGoToPage(0);
  }
}
