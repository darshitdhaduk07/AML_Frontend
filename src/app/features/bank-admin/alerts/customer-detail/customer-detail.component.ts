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
                            <h2>
                                <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px">Alert Group ID</span>
                                {{ group.group_id }}
                            </h2>
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
                                        <span class="alert-label">{{ (alert.transaction || alert.transaction_number) ? 'Transaction' : 'Customer Alert' }}</span>
                                        <span class="alert-val">{{ alert.transaction?.transactionNumber || alert.transaction_number || 'N/A' }}</span>
                                    </div>
                                    <div class="rule-code-row">
                                        <span class="rule-code">{{ alert.ruleCode }}</span>
                                        <span class="rule-type" *ngIf="alert.ruleType">{{ alert.ruleType }}</span>
                                    </div>
                                    <p class="rule-desc">{{ alert.ruleDescription }}</p>

                                    <div class="transaction-details" *ngIf="alert.transaction">
                                        <div class="detail-grid">
                                            <div class="detail-item">
                                                <span class="detail-label">Amount</span>
                                                <span class="detail-value">{{ alert.transaction.amount | currency:'INR' }}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Account</span>
                                                <span class="detail-value">{{ alert.transaction.account }}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Type</span>
                                                <span class="detail-value">{{ alert.transaction.txnType }}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Direction</span>
                                                <span class="detail-value">{{ alert.transaction.direction }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="alert-footer">
                                        <span class="weight-tag">Alert Weight: {{ alert.weight }}</span>
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
        .rule-code-row { margin-bottom: 4px; display: flex; gap: 8px; align-items: center; }
        .rule-code { font-size: 11px; font-weight: 800; color: #6366f1; background: #e0e7ff; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .rule-type { font-size: 10px; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .rule-desc { font-size: 14px; color: #475569; margin: 0 0 12px 0; line-height: 1.5; }
        
        .alert-footer { display: flex; justify-content: space-between; align-items: center; }
        .weight-tag { font-size: 12px; font-weight: 700; color: #0f172a; }
        .status-tag { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: #fee2e2; color: #991b1b; }
        .status-tag.active { background: #dcfce7; color: #166534; }

        .transaction-details { 
            margin: 12px 0; padding: 12px; background: white; border-radius: 8px; 
            border: 1px dashed #e2e8f0; 
        }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .detail-item { display: flex; flex-direction: column; }
        .detail-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .detail-value { font-size: 12px; font-weight: 600; color: #1e293b; }

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
        this.alertService.getCustomerAlerts(this.customerNumber).subscribe({
            next: (customerAlerts: Alert[]) => {
                this.totalWeight = customerAlerts.reduce((sum: number, a: Alert) => sum + (a.weight || 0), 0);
                
                const groups = customerAlerts.reduce((acc: any, alert: Alert) => {
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
