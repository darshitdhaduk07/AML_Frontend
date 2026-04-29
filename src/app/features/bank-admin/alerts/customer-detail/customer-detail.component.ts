import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlertService, Alert } from '../../../../core/services/alert.service';

interface GroupedAlerts {
    group_id: string;
    alerts: Alert[];
}

@Component({
    selector: 'app-customer-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <div class="detail-container">
            <header class="detail-header">
                <div class="back-link">
                    <a routerLink="/bank/dashboard">
                        <span class="material-symbols-outlined">arrow_back</span>
                        Back to Dashboard
                    </a>
                </div>
                <div class="customer-info">
                    <h1>Customer: {{ customerNumber }}</h1>
                    <div class="risk-badge" [style.background-color]="getRiskColor(totalWeight)">
                        Risk Weight: {{ totalWeight }}
                    </div>
                </div>
            </header>

            <div class="detail-content">
                <div *ngIf="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading customer details...</p>
                </div>

                <div *ngIf="!loading">
                    <section class="group-section" *ngFor="let group of groupedAlerts">
                        <div class="group-header">
                            <span class="material-symbols-outlined">folder</span>
                            <h2>Group: {{ group.group_id }}</h2>
                        </div>
                        
                        <div class="alerts-grid">
                            <div class="alert-item-card" *ngFor="let alert of group.alerts">
                                <div class="alert-type-icon">
                                    <span class="material-symbols-outlined">
                                        {{ alert.transaction_number ? 'receipt_long' : 'person_alert' }}
                                    </span>
                                </div>
                                <div class="alert-details">
                                    <div class="alert-id-row">
                                        <span class="alert-label">{{ alert.transaction_number ? 'Transaction' : 'Customer Alert' }}</span>
                                        <span class="alert-val">{{ alert.transaction_number || 'N/A' }}</span>
                                    </div>
                                    <div class="rule-code-row">
                                        <span class="rule-code">{{ alert.ruleCode }}</span>
                                    </div>
                                    <p class="rule-desc">{{ alert.ruleDescription }}</p>
                                    <div class="alert-footer">
                                        <span class="weight-tag">Weight: {{ alert.weight }}</span>
                                        <span class="status-tag" [class.active]="alert.active">
                                            {{ alert.active ? 'Active' : 'Closed' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .detail-container { padding: 32px; background: #f8fafc; min-height: 100vh; }
        .detail-header { margin-bottom: 32px; }
        .back-link a { display: flex; align-items: center; gap: 8px; color: #64748b; text-decoration: none; font-weight: 600; margin-bottom: 16px; }
        .customer-info { display: flex; justify-content: space-between; align-items: center; }
        .risk-badge { padding: 8px 16px; border-radius: 8px; color: white; font-weight: 700; }
        
        .group-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0; }
        .group-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: #1e293b; }
        .group-header h2 { font-size: 18px; font-weight: 700; margin: 0; }
        
        .alerts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .alert-item-card { display: flex; gap: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .alert-type-icon { width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; }
        
        .alert-details { flex: 1; }
        .alert-id-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
        .alert-label { color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .alert-val { color: #1e293b; font-weight: 600; }
        .rule-code-row { margin-bottom: 4px; }
        .rule-code { font-size: 11px; font-weight: 800; color: #6366f1; background: #e0e7ff; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .rule-desc { font-size: 14px; color: #475569; margin: 0 0 12px 0; line-height: 1.5; }
        
        .alert-footer { display: flex; justify-content: space-between; align-items: center; }
        .weight-tag { font-size: 12px; font-weight: 700; color: #0f172a; }
        .status-tag { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: #fee2e2; color: #991b1b; }
        .status-tag.active { background: #dcfce7; color: #166534; }

        .loading-state { text-align: center; padding: 64px; color: #64748b; }
        .loading-spinner { width: 40px; height: 40px; border: 3px solid #f1f5f9; border-top: 3px solid #000000; border-radius: 50%; margin: 0 auto 16px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `]
})
export class CustomerDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private alertService = inject(AlertService);
    
    customerNumber: string = '';
    groupedAlerts: GroupedAlerts[] = [];
    totalWeight: number = 0;
    loading = true;

    ngOnInit() {
        this.customerNumber = this.route.snapshot.paramMap.get('customerNumber') || '';
        this.loadCustomerAlerts();
    }

    loadCustomerAlerts() {
        this.loading = true;
        this.alertService.getAlerts().subscribe({
            next: (data) => {
                const customerAlerts = data.filter(a => a.customer_number === this.customerNumber);
                this.totalWeight = customerAlerts.reduce((sum, a) => sum + (a.weight || 0), 0);
                
                const groups = customerAlerts.reduce((acc, alert) => {
                    if (!acc[alert.group_id]) {
                        acc[alert.group_id] = [];
                    }
                    acc[alert.group_id].push(alert);
                    return acc;
                }, {} as Record<string, Alert[]>);

                this.groupedAlerts = Object.keys(groups).map(id => ({
                    group_id: id,
                    alerts: groups[id]
                }));
                
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading details:', err);
                this.loading = false;
            }
        });
    }

    getRiskColor(weight: number): string {
        if (weight > 70) return '#ef4444'; // Red
        if (weight > 30) return '#f59e0b'; // Yellow
        return '#10b981'; // Green
    }
}
