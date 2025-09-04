import {
  Component,
  computed,
  input,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard';
import { TransactionsService } from '../../services/transactions/transactions';
import { BudgetsService } from '../../services/budgets/budgets';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgModel,
  FormBuilder,
  FormGroup,
  Validators,
  Form,
  FormControl,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-summary-statistics',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './summary-statistics.html',
  styleUrl: './summary-statistics.scss',
})
export class SummaryStatisticsComponent implements OnInit {
  summaryForm: FormGroup = new FormGroup({});

  @Input() totalIncome = 0;
  @Input() totalBudget = 0;
  @Input() totalExpenses = 0;
  @Input() remainingBudget = 0;
  totalBudgetAllocated = input<number>(0);
  totalBudgetUnallocated = input<number>(0);

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
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

  valueFormatter(value: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  }
}
