import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Authentication Routes
  { 
    path: 'admin/login', 
    loadComponent: () => import('./features/auth/login/login-page/login-page.component')
      .then(m => m.LoginPageComponent),
    data: { isSystemAdmin: true }
  },
  { 
    path: ':bankName/auth/login', 
    loadComponent: () => import('./features/auth/login/login-page/login-page.component')
      .then(m => m.LoginPageComponent),
    data: { isSystemAdmin: false }
  },

  // System Admin Protected Routes
  {
    path: 'sys',
    loadComponent: () => import('./layout/system-admin/sys-admin-layout.component')
      .then(m => m.SystemAdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['SYSTEM_ADMIN'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/system-admin/dashboard/dashboard.component').then(m => m.SystemAdminDashboardComponent) },
      { path: 'rule-engine', loadComponent: () => import('./features/system-admin/rule-engine/rule-registration/rule-registration.component').then(m => m.RuleRegistrationComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Bank Admin Protected Routes
  {
    path: 'bank',
    loadComponent: () => import('./layout/bank-admin/bank-admin-layout.component')
      .then(m => m.BankAdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['BANK_ADMIN'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/bank-admin/dashboard/dashboard.component').then(m => m.BankAdminDashboardComponent) },
      { path: 'ingestion/upload', loadComponent: () => import('./features/bank-admin/ingestion/batch-upload/batch-upload.component').then(m => m.BatchUploadComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Compliance Officer Protected Routes
  {
    path: 'co',
    loadComponent: () => import('./layout/compliance-officer/co-layout.component')
      .then(m => m.ComplianceOfficerLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['COMPLIANCE_OFFICER'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/compliance-officer/dashboard/dashboard.component').then(m => m.ComplianceOfficerDashboardComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Fallback Routes
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin/login' } 
];
