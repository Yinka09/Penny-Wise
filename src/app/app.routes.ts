import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { DashboardComponent } from './pages/main/dashboard/dashboard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup,
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./pages/main/main.routes').then((m) => m.MAIN_ROUTES),
  },
  {
    path: '*',
    component: PageNotFoundComponent,
  },
];
