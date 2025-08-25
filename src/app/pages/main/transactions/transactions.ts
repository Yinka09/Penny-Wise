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
import { Router } from '@angular/router';

ModuleRegistry.registerModules([
  RowStyleModule,
  CellStyleModule,
  NumberFilterModule,
]);

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [ToastModule, CommonModule, AgGridAngular],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  providers: [MessageService],
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

  selectedTab = 'All';

  isShowSpinner: boolean = true;

  isTableDataComplete: boolean = false;
  displayTableData: ITransactionsTableData[] = [];
  transactionTableDetails: ITransactionsTableData[] = [];

  // defaultColDef: ColDef = {
  //   // flex: 1,
  //   minWidth: 120,
  //   resizable: true,
  // };

  defaultColDef: ColDef = {
    flex: 1, // makes columns auto-fill available width
    minWidth: 120, // prevents squishing too much
    resizable: true,
  };

  rowClass = 'ag-grid-table ';
  columnDefs: ColDef[] = [
    {
      headerName: 'DATE',
      field: 'date',
      // filter: 'agDateColumnFilter',
      filter: true,
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
      // filter: 'agTextColumnFilter',
      filter: true,
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
  ];

  rowHeight = 70;
  tableStyle = 'height: 100%; margin: 10px auto 0 auto; width: 100%;';
  currentUrl = '';
  constructor(private router: Router, private mainService: MainService) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this.mainService.setIsTransactionPage(true);
  }

  onTabChange(tab: { label: string; value: string }) {
    this.selectedTab = tab.value;

    this.displayTableData = TransactionsMockTableData.filter(
      (el: any) => this.selectedTab === 'All' || el.type === this.selectedTab
    );
  }

  getTransactionTableData(params: GridReadyEvent<ITransactionsTableData>) {
    this.displayTableData = TransactionsMockTableData;
    this.isTableDataComplete = true;
    this.showSpinner();
  }

  showSpinner() {
    if (this.isTableDataComplete) {
      this.isShowSpinner = false;
    }
  }

  currentUrlIsTransaction() {
    return this.currentUrl === '/main/transactions';
  }
}
