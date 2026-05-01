import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, Alert, AssignmentResponseDto } from '../../../core/services/alert.service';
import { AssignmentModalComponent } from './components/assignment-modal/assignment-modal.component';
import { DataService } from '../../../core/services/data.service';

interface UniqueCustomer {
    customer_number: string;
    totalWeight: number;
    alertCount: number;
    alerts: Alert[];
}

@Component({
    selector: 'app-alert-dashboard',
    standalone: true,
    imports: [CommonModule, AssignmentModalComponent],
    template: `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1>{{ role === 'ADMIN' ? 'Alert Dashboard' : 'Alert Review' }}</h1>
                <p>{{ role === 'ADMIN' ? 'Institutional risk summary by unique customer.' : 'Manage and investigate assigned customer alerts.' }}</p>
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
                    <p>Fetching {{ role === 'ADMIN' ? 'institutional' : 'assigned' }} alerts...</p>
                </div>

                <div *ngIf="!loading && customers.length === 0" class="loading-state">
                    <span class="material-symbols-outlined" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px">info</span>
                    <p>No {{ role === 'ADMIN' ? 'active' : 'assigned' }} alerts found.</p>
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
                        <button *ngIf="role === 'ADMIN'" class="btn btn-outline" (click)="openAssignmentModal(customer.customer_number)">Assign To</button>
                        <button class="btn btn-primary" (click)="seeDetails(customer.customer_number)">See Details</button>
                    </div>
                </div>
            </div>

            <!-- Assignment Modal -->
            <app-assignment-modal
                *ngIf="showAssignmentModal && role === 'ADMIN'"
                [customerNumber]="selectedCustomerNumber"
                (close)="showAssignmentModal = false"
                (select)="onOfficerSelected($event)"
            ></app-assignment-modal>
        </div>
    `,
    styleUrl: './dashboard.component.css',
})
export class AlertDashboardComponent implements OnInit {
    @Input() role: 'ADMIN' | 'OFFICER' = 'ADMIN';

    private alertService = inject(AlertService);
    private dataService = inject(DataService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    
    customers: UniqueCustomer[] = [];
    loading = true;
    Math = Math;

    // Modal state
    showAssignmentModal = false;
    selectedCustomerNumber = '';

    ngOnInit() {
        const routeRole = this.route.snapshot.data['role'];
        if (routeRole) this.role = routeRole;
        this.loadAlerts();
    }

    loadAlerts() {
        this.loading = true;
        if (this.role === 'ADMIN') {
            this.alertService.getAlerts().subscribe({
                next: (data: Alert[]) => {
                    this.groupAlertsByCustomer(data);
                    this.loading = false;
                },
                error: (err: any) => {
                    console.error('Error fetching alerts:', err);
                    this.loading = false;
                }
            });
        } else {
            this.alertService.getAssignments().subscribe({
                next: (data: AssignmentResponseDto[]) => {
                    this.mapAssignmentsToCustomers(data);
                    this.loading = false;
                },
                error: (err: any) => {
                    console.error('Error fetching assignments:', err);
                    this.loading = false;
                }
            });
        }
    }

    groupAlertsByCustomer(alerts: Alert[]) {
        const grouped = alerts.reduce((acc: Record<string, UniqueCustomer>, alert: Alert) => {
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

    mapAssignmentsToCustomers(assignments: AssignmentResponseDto[]) {
        this.customers = assignments.map(assignment => ({
            customer_number: assignment.customerResponseDto.customerNumber,
            totalWeight: assignment.riskScore,
            alertCount: assignment.customerResponseDto.alerts.length,
            alerts: []
        }));
    }

    getRiskColor(weight: number): string {
        if (weight > 70) return '#ef4444'; // Red
        if (weight > 30) return '#f59e0b'; // Yellow
        return '#10b981'; // Green
    }

    seeDetails(customerNumber: string) {
        const base = this.role === 'ADMIN' ? '/bank' : '/co';
        this.router.navigate([`${base}/alerts/customer`, customerNumber]);
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
            next: (response: string) => {
                alert(`Successfully assigned customer ${this.selectedCustomerNumber} to ${email}`);
            },
            error: (err: any) => {
                console.error('Assignment failed', err);
                alert('Failed to assign investigation. Please try again.');
            }
        });
    }
}
