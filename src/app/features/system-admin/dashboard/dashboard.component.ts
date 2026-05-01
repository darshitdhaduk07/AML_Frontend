import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../core/services/data.service';

@Component({
    selector: 'app-sys-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1>System Governance Dashboard</h1>
                <p>
                    Welcome to the AML Platform control center. Monitor global
                    health and manage bank registrations.
                </p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Onboarded Banks</div>
                    <div class="stat-value">{{ totalBanks }}</div>
                    <div class="stat-meta success">
                        <span class="material-symbols-outlined"
                            >account_balance</span
                        >
                        <span>Active Institutional Tenants</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Global Rule Templates</div>
                    <div class="stat-value">{{ totalTemplates }}</div>
                    <div class="stat-meta info">
                        <span class="material-symbols-outlined"
                            >settings_input_component</span
                        >
                        <span>Available Detection Logic</span>
                    </div>
                </div>
            </div>

            <div class="actions-section">
                <h3>Quick Actions</h3>
                <div class="action-buttons">
                    <a routerLink="/sys/rule-engine" class="action-btn">
                        <span class="material-symbols-outlined"
                            >add_circle</span
                        >
                        Rule Engine
                    </a>
                    <a routerLink="/sys/bank-registry" class="action-btn">
                        <span class="material-symbols-outlined"
                            >account_balance</span
                        >
                        Onboard Bank
                    </a>
                </div>
            </div>
        </div>
    `,
    styleUrl: './dashboard.component.css',
})
export class SystemAdminDashboardComponent implements OnInit {
    private dataService = inject(DataService);

    totalBanks: number = 0;
    totalTemplates: number = 0;

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats() {
        this.dataService.getTenants(0, 1).subscribe({
            next: (res) => {
                this.totalBanks = res.totalElements;
            },
            error: (err) => console.error('Failed to load bank count', err)
        });

        this.dataService.getRuleTemplates().subscribe({
            next: (res) => {
                this.totalTemplates = res.length;
            },
            error: (err) => console.error('Failed to load template count', err)
        });
    }
}
