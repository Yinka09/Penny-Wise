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
import { ToastModule } from 'primeng/toast';
import { Subject, type Subscription } from 'rxjs';
import { AgTableComponent } from '../../../components/ag-table/ag-table';
import { ReportsService } from '../../../services/reports/reports';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';

ModuleRegistry.registerModules([
  RowStyleModule,
  CellStyleModule,
  NumberFilterModule,
]);

@Component({
  selector: 'app-reports',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    KeyInsights,
    SummaryStatisticsComponent,
    ToastModule,
    CommonModule,

    AgTableComponent,
    AgCharts,
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

  displayTableData: ITransactionsTableData[] = [];

  isAllDataLoaded = {
    isAllCustomersDataLoaded: false,
    isAllTransactionsDataLoaded: false,
    isAllTableDataLoaded: false,
    isAllAgChartDataLoaded: false,
  };

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
  donutChartConfig: any;
  barChartConfig: any;
  lineChartConfig: any;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private budgetService: BudgetsService,
    private reportsService: ReportsService
  ) {}
  ngOnInit(): void {
    // this.budgetCardData.set(this.budgetService.budgetCardData());
    // console.log(this.reportsService.getBarChartConfig());

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
    this.buildForm();
    this.getTransactionTableDetails();
    this.setDonutChartConfig();
  }

  setDonutChartConfig() {
    this.donutChartConfig = this.reportsService.getDonutChartConfig();
    this.barChartConfig = this.reportsService.getBarChartConfig();
    this.lineChartConfig = this.reportsService.getLineChartConfig();
  }

  buildForm() {
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

  getTransactionTableDetails() {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError

    this.displayTableData = this.dashboardService
      .getAllTransactions()
      .slice(0, 5);
    this.isAllDataLoaded.isAllTableDataLoaded = true;
  }
  getOverbudgetCategories() {
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
