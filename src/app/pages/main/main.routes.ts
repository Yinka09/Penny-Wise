import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { MainComponent } from './main';
import { TransactionsComponent } from './transactions/transactions';
import { BudgetsComponent } from './budgets/budgets';
import { ReportsComponent } from './reports/reports';
import { ProfileComponent } from './profile/profile';
import { SavingsOverviewComponent } from './savings-overview/savings-overview';
import { SavingsHistoryComponent } from './savings-history/savings-history';

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
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'savings',
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: SavingsOverviewComponent },
          { path: 'history', component: SavingsHistoryComponent },
        ],
      },
    ],
  },
];
