import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sys-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>System Governance Dashboard</h1>
        <p>Welcome to the AML Platform control center. Monitor global health and manage bank registrations.</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Active Banks</div>
          <div class="stat-value">24</div>
          <div class="stat-meta success">
            <span class="material-symbols-outlined">trending_up</span>
            <span>+2 this month</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-label">System Health</div>
          <div class="stat-value" style="color: #16A34A">Operational</div>
          <div class="stat-meta">
            <span class="material-symbols-outlined">check_circle</span>
            <span>All systems go</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Alerts (24h)</div>
          <div class="stat-value">1,204</div>
          <div class="stat-meta warning">
            <span class="material-symbols-outlined">warning</span>
            <span>12 attention required</span>
          </div>
        </div>
      </div>

      <div class="actions-section">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <a routerLink="/sys/rule-engine" class="action-btn">
            <span class="material-symbols-outlined">add_circle</span>
            Rule Engine
          </a>
          <a routerLink="/sys/bank-registry" class="action-btn">
            <span class="material-symbols-outlined">account_balance</span>
            Onboard Bank
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class SystemAdminDashboardComponent {}
