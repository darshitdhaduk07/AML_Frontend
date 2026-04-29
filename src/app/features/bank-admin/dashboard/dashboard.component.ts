import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-bank-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="dashboard-container">
            <h1>Bank Administration Dashboard</h1>
            <p>
                Manage your institution's compliance workflows, users, and data
                ingestion.
            </p>
        </div>
    `,
    styles: ['.dashboard-container { padding: 24px; }'],
})
export class BankAdminDashboardComponent {}
