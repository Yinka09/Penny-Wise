import {
  Component,
  computed,
  Input,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard';
import { TransactionsService } from '../../services/transactions/transactions';
import { BudgetsService } from '../../services/budgets/budgets';
import { IBudgetsCategory } from '../../models/interfaces';

@Component({
  selector: 'app-key-insights',
  imports: [],
  templateUrl: './key-insights.html',
  styleUrl: './key-insights.scss',
})
export class KeyInsights implements OnInit {
  @Input() totalBudget = 0;
  summaryMsg = input<string>('');
  currentMonth = new Date().toLocaleString('default', { month: 'long' });
  currentYear = new Date().getFullYear();
  topExpense = input<string>('');
  topExpensePercentage = input<number>(0);
  overbudgetCategories = input<IBudgetsCategory[]>([]);
  highestBudgetCategory = input<{ category: string; amount: number }>({
    category: '',
    amount: 0,
  });
  getHighestBudgetCategory = input<string | null>(null);
  constructor() {}

  ngOnInit(): void {}
  valueFormatter(value: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  }

  isLastItem(index: number, array: any[]) {
    return index === array.length - 1;
  }
}
