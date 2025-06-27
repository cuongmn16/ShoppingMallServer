import { Routes } from '@angular/router';
import {ListProductsComponent} from './components/manage-product/list-products/list-products.component';
import {AddProductComponent} from './components/manage-product/add-product/add-product.component';
import {LoginInComponent} from './components/login-in/login-in.component';
import {authGuard} from './auth.guard';
import {ManageOrderComponent} from './components/manage-order/manage-order.component';


export const routes: Routes = [
  { path : '', component: ListProductsComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginInComponent },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./components/manage-product/add-product/add-product.component')
        .then(m => m.AddProductComponent)
  },
  { path: 'order', component: ManageOrderComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' },

];
