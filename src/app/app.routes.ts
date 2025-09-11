import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { DashboardComponent } from './pages/main/dashboard/dashboard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found';
import { AuthGuard } from './services/auth/auth.guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
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
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/main/main.routes').then((m) => m.MAIN_ROUTES),
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
