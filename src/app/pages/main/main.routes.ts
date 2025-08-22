import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { MainComponent } from './main';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ],
  },
];
