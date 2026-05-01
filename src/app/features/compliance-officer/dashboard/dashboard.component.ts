import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDashboardComponent } from '../../../shared/components/alert-dashboard/dashboard.component';
import { CaseListComponent } from '../../../shared/components/case-list/case-list.component';

@Component({
    selector: 'app-compliance-officer-dashboard',
    standalone: true,
    imports: [CommonModule, AlertDashboardComponent, CaseListComponent],
    template: `
        <div class="dashboard-page">
            <div class="tabs">
                <button class="tab-btn" [class.active]="activeTab === 'alerts'" (click)="activeTab = 'alerts'">
                    <span class="material-symbols-outlined">warning</span>
                    Assigned Alerts
                </button>
                <button class="tab-btn" [class.active]="activeTab === 'cases'" (click)="activeTab = 'cases'">
                    <span class="material-symbols-outlined">folder_shared</span>
                    Investigation Cases
                </button>
            </div>

            <div class="tab-content">
                <app-alert-dashboard *ngIf="activeTab === 'alerts'" role="OFFICER"></app-alert-dashboard>
                <app-case-list *ngIf="activeTab === 'cases'" role="OFFICER"></app-case-list>
            </div>
        </div>
    `,
    styles: [`
        .dashboard-page { background: #f8fafc; min-height: 100vh; }
        .tabs { 
            display: flex; gap: 32px; padding: 16px 32px; 
            background: white; border-bottom: 1px solid #e2e8f0;
            position: sticky; top: 0; z-index: 10;
        }
        .tab-btn { 
            display: flex; align-items: center; gap: 8px;
            padding: 8px 4px; border: none; background: none;
            color: #64748b; font-weight: 600; cursor: pointer;
            border-bottom: 2px solid transparent; transition: all 0.2s;
        }
        .tab-btn:hover { color: #1e293b; }
        .tab-btn.active { color: #6366f1; border-bottom-color: #6366f1; }
        .tab-btn .material-symbols-outlined { font-size: 20px; }
        .tab-content { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `],
})
export class ComplianceOfficerDashboardComponent {
    activeTab: 'alerts' | 'cases' = 'alerts';
}
