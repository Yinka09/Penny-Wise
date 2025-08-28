import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { MainComponent } from './main';
import { TransactionsComponent } from './transactions/transactions';
import { BudgetsComponent } from './budgets/budgets';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'budgets',
        component: BudgetsComponent,
      },
    ],
  },
];
