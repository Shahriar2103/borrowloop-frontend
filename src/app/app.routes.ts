
import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Items } from './pages/items/items';
import { ItemDetails } from './pages/item-details/item-details';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home | BorrowLoop'
  },
  {
    path: 'items',
    component: Items,
    title: 'Browse Items | BorrowLoop'
  },
  {
    path: 'items/:id',
    component: ItemDetails,
    title: 'Item Details | BorrowLoop'
  },
  {
    path: 'login',
    component: Login,
    title: 'Login | BorrowLoop'
  },
  {
    path: 'register',
    component: Register,
    title: 'Sign Up | BorrowLoop'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
