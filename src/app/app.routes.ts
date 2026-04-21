import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. System Admin Login (No bank name required)
  { 
    path: 'admin/login', 
    loadComponent: () => import('./features/auth/login/sys-admin-login-page/sys-admin-login-page.component')
      .then(m => m.SysAdminLoginPageComponent) 
  },
  
  // 2. Tenant Login (Requires a bank name in the URL)
  { 
    path: ':bankName/auth/login', 
    loadComponent: () => import('./features/auth/login/login-page/login-page.component')
      .then(m => m.LoginPageComponent) 
  },

  // 3. Fallback Routes
  // If someone just types localhost:4200, redirect them to the admin login for now
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  // If they type a URL that doesn't exist, catch it and redirect
  { path: '**', redirectTo: 'admin/login' } 
];