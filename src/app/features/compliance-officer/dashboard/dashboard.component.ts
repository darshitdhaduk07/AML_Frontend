import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compliance-officer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Compliance Monitoring Dashboard</h1>
      <p>Investigate alerts, screen transactions, and manage case workflows.</p>
    </div>
  `,
  styles: ['.dashboard-container { padding: 24px; }']
})
export class ComplianceOfficerDashboardComponent {}
