import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
  ICardData,
  IDashboardTableData,
  ITransactions,
  ICustomers,
  IChartData,
  ITransactionsTableData,
} from '../../../models/interfaces';
import {
  CardDetails,
  CustomersMockData,
  TransactionsMockTableData,
} from '../../../models/mock-data';
import { CardComponent } from '../../../components/card/card';
import { AgChartComponent } from '../../../components/ag-chart/ag-chart';
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
} from 'ag-grid-community';

import { RowStyleModule } from 'ag-grid-community';

import { CellStyleModule } from 'ag-grid-community';
import { NumberFilterModule } from 'ag-grid-community';

ModuleRegistry.registerModules([
  RowStyleModule,
  CellStyleModule,
  NumberFilterModule,
]);

import { AgTableComponent } from '../../../components/ag-table/ag-table';
import { DashboardService } from '../../../services/dashboard/dashboard';
import {
  routerTransitions,
  routerTransitions2,
} from '../../../services/animation/animation';
import { SpinnerComponent } from '../../../components/spinner/spinner';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    ToastModule,
    CommonModule,
    CardComponent,
    AgChartComponent,
    AgGridAngular,
    SpinnerComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [MessageService],
  animations: [routerTransitions, routerTransitions2],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isVisible = false;
  cardData: ICardData[] = [];
  chartData: { expense: string; amount: number }[] = [];

  isShowSpinner = true;

  monthName = new Date().toLocaleString('default', { month: 'long' });
  year = new Date().getFullYear();

  allSubscription: Subscription[] = [];

  private destroy$ = new Subject<void>();
  rowClass = 'ag-grid-table ';

  columnDefs: ColDef[] = [
    {
      headerName: 'DATE',
      field: 'date',
      // filter: 'agDateColumnFilter',
      filter: false,
      width: 100,
    },
    {
      headerName: 'DESCRIPTION',
      field: 'description',
      filter: false,
      cellStyle: {
        fontWeight: '600',
        // textDecoration: 'underline',
      },
      // flex: 1,
    },
    {
      headerName: 'CATEGORY',
      field: 'category',
      // filter: 'agTextColumnFilter',
      filter: false,
      // flex: 1,
      width: 100,
    },
    {
      headerName: 'AMOUNT (₦)',
      field: 'amount',
      filter: false,
      // filter: 'agNumberColumnFilter',
      valueFormatter: (params) => {
        return params.value != null
          ? new Intl.NumberFormat('en-NG', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(params.value)
          : '';
      },
    },

    {
      headerName: 'TYPE',
      field: 'type',
      filter: false,
      // filter: true,

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
      width: 140,
      // flex: 0,
    },
  ];

  defaultColDef: ColDef = {
    // flex: 1,
    minWidth: 120,
    resizable: true,
  };

  isAllDataLoaded = {
    isAllCustomersDataLoaded: false,
    isAllTransactionsDataLoaded: false,
    isAllTableDataLoaded: false,
    isAllAgChartDataLoaded: false,
  };

  displayTableData: ITransactionsTableData[] = [];
  transactionsData: ITransactions[] = [];

  transactionTableDetails: ITransactionsTableData[] = [];
  isLoading = true;
  constructor(
    private mainService: MainService,
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isVisible = true;
    this.mainService.headerTitle.set('Dashboard');
    // this.mainService.setHeaderTitle('Dashboard');
    // this.cardData = CardDetails;

    this.mainService.setIsTransactionPage(false);

    setTimeout(() => {
      this.cardData = this.dashboardService.createDashboardCards();
      this.chartData = this.dashboardService.chartData();
      this.isLoading = false;
    }, 1000);

    // console.log(this.dashboardService.createDashboardCards());
    // console.log(this.dashboardService.chartData());
  }

  getData() {
    return this.chartData;
  }

  getTransactionTableDetails(params: GridReadyEvent<ITransactionsTableData>) {
    this.displayTableData = this.dashboardService
      .getAllTransactions()
      .slice(0, 5);
    this.isLoading = false;

    this.isAllDataLoaded.isAllTableDataLoaded = true;
  }

  onTransactionSelectChange(event: any) {
    const selectedTransactionOption = event.target.value;
    if (selectedTransactionOption === 'All') {
      this.displayTableData = this.dashboardService
        .getAllTransactions()
        .slice(0, 5);
    } else {
      this.displayTableData = this.dashboardService
        .getAllTransactions()
        .filter((el) => el.type === selectedTransactionOption)
        .slice(0, 5);
    }
  }

  showSpinner() {
    const allTrue = Object.values(this.isAllDataLoaded).every(
      (val) => val === true
    );
    if (allTrue) {
      this.isShowSpinner = false;
    } else {
      return;
      // this.isShowSpinner = true;
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
