import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sys-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>System Governance Dashboard</h1>
      <p>Welcome to the AML Platform control center. Monitor global health and manage bank registrations.</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Active Banks</h3>
          <p class="value">24</p>
        </div>
        <div class="stat-card">
          <h3>System Health</h3>
          <p class="value status-ok">Operational</p>
        </div>
        <div class="stat-card">
          <h3>Alerts (24h)</h3>
          <p class="value">1,204</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-top: 24px; }
    .stat-card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .value { font-size: 2rem; font-weight: bold; margin-top: 8px; }
    .status-ok { color: #10b981; }
  `]
})
export class SystemAdminDashboardComponent {}
