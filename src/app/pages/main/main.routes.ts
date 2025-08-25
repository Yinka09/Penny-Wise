import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { MainComponent } from './main';
import { TransactionsComponent } from './transactions/transactions';

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
    ],
  },
];
