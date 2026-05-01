import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService, Alert } from '../../../core/services/alert.service';
import { AssignmentModalComponent } from './components/assignment-modal/assignment-modal.component';
import { DataService } from '../../../core/services/data.service';

interface UniqueCustomer {
    customer_number: string;
    totalWeight: number;
    alertCount: number;
    alerts: Alert[];
}

@Component({
    selector: 'app-bank-admin-dashboard',
    standalone: true,
    imports: [CommonModule, AssignmentModalComponent],
    template: `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1>Alert Dashboard</h1>
                <p>Institutional risk summary by unique customer.</p>
            </div>

            <div class="alerts-card">
                <div class="table-header">
                    <div class="header-item">Customer Number</div>
                    <div class="header-item" style="text-align: center">Risk Weight</div>
                    <div class="header-item" style="text-align: center">Total Alerts</div>
                    <div class="header-item" style="text-align: right">Actions</div>
                </div>

                <div *ngIf="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Fetching institutional alerts...</p>
                </div>

                <div *ngIf="!loading && customers.length === 0" class="loading-state">
                    <span class="material-symbols-outlined" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px">info</span>
                    <p>No active alerts found for your institution.</p>
                </div>

                <div *ngFor="let customer of customers; last as isLast" class="alert-row" [style.border-bottom]="isLast ? 'none' : '1px solid #f1f5f9'">
                    <div class="customer-info">
                        <div class="avatar">
                            <span class="material-symbols-outlined">person</span>
                        </div>
                        <span class="customer-number">{{ customer.customer_number }}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: center">
                        <div class="risk-score-container">
                            <div class="risk-value" [style.color]="getRiskColor(customer.totalWeight)">
                                {{ customer.totalWeight }}
                            </div>
                            <div class="risk-bar-bg" style="width: 120px">
                                <div class="risk-bar-fill" 
                                     [style.width.%]="Math.min(customer.totalWeight, 100)"
                                     [style.background-color]="getRiskColor(customer.totalWeight)">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert-count">
                        <span class="status-badge" [style.background]="'#f1f5f9'" [style.color]="'#475569'">
                            {{ customer.alertCount }}
                        </span>
                    </div>

                    <div class="actions">
                        <button class="btn btn-outline" (click)="openAssignmentModal(customer.customer_number)">Assign To</button>
                        <button class="btn btn-primary" (click)="seeDetails(customer.customer_number)">See Details</button>
                    </div>
                </div>
            </div>

            <!-- Assignment Modal -->
            <app-assignment-modal
                *ngIf="showAssignmentModal"
                [customerNumber]="selectedCustomerNumber"
                (close)="showAssignmentModal = false"
                (select)="onOfficerSelected($event)"
            ></app-assignment-modal>
        </div>
    `,
    styleUrl: './dashboard.component.css',
})
export class BankAdminDashboardComponent implements OnInit {
    private alertService = inject(AlertService);
    private dataService = inject(DataService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    
    customers: UniqueCustomer[] = [];
    loading = true;
    Math = Math;

    // Modal state
    showAssignmentModal = false;
    selectedCustomerNumber = '';

    ngOnInit() {
        this.loadAlerts();
    }

    loadAlerts() {
        this.loading = true;
        this.alertService.getAlerts().subscribe({
            next: (data) => {
                this.groupAlertsByCustomer(data);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching alerts:', err);
                this.loading = false;
            }
        });
    }

    groupAlertsByCustomer(alerts: Alert[]) {
        const grouped = alerts.reduce((acc, alert) => {
            if (!acc[alert.customer_number]) {
                acc[alert.customer_number] = {
                    customer_number: alert.customer_number,
                    totalWeight: 0,
                    alertCount: 0,
                    alerts: []
                };
            }
            acc[alert.customer_number].totalWeight += alert.weight || 0;
            acc[alert.customer_number].alertCount++;
            acc[alert.customer_number].alerts.push(alert);
            return acc;
        }, {} as Record<string, UniqueCustomer>);

        this.customers = Object.values(grouped);
    }

    getRiskColor(weight: number): string {
        if (weight > 70) return '#ef4444'; // Red
        if (weight > 30) return '#f59e0b'; // Yellow
        return '#10b981'; // Green
    }

    seeDetails(customerNumber: string) {
        this.router.navigate(['/bank/alerts/customer', customerNumber]);
    }

    openAssignmentModal(customerNumber: string) {
        this.selectedCustomerNumber = customerNumber;
        this.showAssignmentModal = true;
    }

    onOfficerSelected(email: string) {
        this.showAssignmentModal = false;
        
        const payload = {
            customerNumber: this.selectedCustomerNumber,
            complianceOfficerEmail: email
        };

        this.dataService.assignInvestigation(payload).subscribe({
            next: (response) => {
                this.toastService.success(`Successfully assigned customer ${this.selectedCustomerNumber} to ${email}`);
                this.loadAlerts(); // Refresh to remove the assigned alert
            },
            error: (err) => {
                console.error('Assignment failed', err);
                // ErrorInterceptor will show the error toast
            }
        });
    }
}
