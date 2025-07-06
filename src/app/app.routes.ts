import { Routes } from '@angular/router';
import {LoginInComponent} from './components/login-in/login-in.component';
import {ManageOrderComponent} from './components/manage-order/manage-order.component';
import {ManageProductComponent} from './components/manage-product/manage-product.component';
import {DashboardAnalyticsComponent} from './components/dashboard-analytics/dashboard-analytics.component';
import {authGuard} from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginInComponent },
  {
    path: 'analytics',
    component: DashboardAnalyticsComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    component: ManageProductComponent,
    canActivate: [authGuard]
  },
  {
    path: 'order',
    component: ManageOrderComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
