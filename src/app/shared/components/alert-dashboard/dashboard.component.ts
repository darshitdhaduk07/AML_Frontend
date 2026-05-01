import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { AlertService, Alert, AssignmentResponseDto } from '../../../core/services/alert.service';
import { AssignmentModalComponent } from './components/assignment-modal/assignment-modal.component';
import { DataService } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { CaseListComponent } from '../case-list/case-list.component';

interface UniqueCustomer {
    customer_number: string;
    totalWeight: number;
    alertCount: number;
    alerts: Alert[];
}

@Component({
    selector: 'app-alert-dashboard',
    standalone: true,
    imports: [CommonModule, AssignmentModalComponent, PaginatorComponent, CaseListComponent],
    template: `
        <div class="dashboard-container">
            <div class="dashboard-header" *ngIf="role === 'ADMIN'">
                <div class="tabs" style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 24px">
                    <button class="tab-btn" [class.active]="activeTab === 'alerts'" (click)="activeTab = 'alerts'">Alerts</button>
                    <button class="tab-btn" [class.active]="activeTab === 'cases'" (click)="activeTab = 'cases'">Investigation Cases</button>
                </div>
                
                <div *ngIf="activeTab === 'alerts'">
                    <h1>Alert Dashboard</h1>
                    <p>Institutional risk summary by unique customer.</p>
                </div>
                <div *ngIf="activeTab === 'cases'">
                    <h1>Case Management</h1>
                    <p>Track and audit formal investigation cases.</p>
                </div>
            </div>

            <div *ngIf="activeTab === 'alerts'" class="alerts-card">
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

                <div *ngIf="!loading && customers.length > 0">
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

                <app-paginator
                    *ngIf="!loading && totalElements > 0"
                    [length]="totalElements"
                    [pageSize]="pageSize"
                    [pageIndex]="pageIndex"
                    (page)="onPageChange($event)"
                ></app-paginator>
            </div>

            <app-case-list *ngIf="activeTab === 'cases'" [role]="role"></app-case-list>

            <!-- Assignment Modal -->
            <app-assignment-modal
                *ngIf="showAssignmentModal && role === 'ADMIN'"
                [customerNumber]="selectedCustomerNumber"
                (close)="showAssignmentModal = false"
                (select)="onOfficerSelected($event)"
            ></app-assignment-modal>
        </div>
    `,
    styles: [`
        .tab-btn { padding: 8px 16px; border: none; background: none; font-weight: 600; color: #64748b; cursor: pointer; border-bottom: 2px solid transparent; }
        .tab-btn.active { color: #6366f1; border-bottom-color: #6366f1; }
    `],
    styleUrl: './dashboard.component.css',
})
export class AlertDashboardComponent implements OnInit {
    @Input() role: 'ADMIN' | 'OFFICER' = 'ADMIN';

    private alertService = inject(AlertService);
    private dataService = inject(DataService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);
    
    customers: UniqueCustomer[] = [];
    loading = true;
    Math = Math;
    activeTab: 'alerts' | 'cases' = 'alerts';

    // Pagination state
    pageIndex = 0;
    pageSize = 10;
    totalElements = 0;

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
        this.customers = []; // Clear existing data while loading
        
        const observable: Observable<any> = this.role === 'ADMIN' 
            ? this.alertService.getAlerts(this.pageIndex, this.pageSize)
            : this.alertService.getAssignments(this.pageIndex, this.pageSize);

        observable.pipe(
            finalize(() => {
                this.loading = false;
            })
        ).subscribe({
            next: (response: any) => {
                console.log(`[AlertDashboard] Received ${this.role} response:`, response);
                if (response && response.content) {
                    this.totalElements = response.totalElements || 0;
                    if (this.role === 'ADMIN') {
                        this.groupAlertsByCustomer(response.content);
                    } else {
                        this.mapAssignmentsToCustomers(response.content);
                    }
                } else if (Array.isArray(response)) {
                    console.warn(`[AlertDashboard] Received raw array instead of PaginatedResponse. Fixing...`);
                    this.totalElements = response.length;
                    if (this.role === 'ADMIN') {
                        this.groupAlertsByCustomer(response);
                    } else {
                        this.mapAssignmentsToCustomers(response);
                    }
                } else {
                    console.error(`[AlertDashboard] Unexpected response structure:`, response);
                    this.customers = [];
                }
            },
            error: (err: any) => {
                console.error(`[AlertDashboard] API Error:`, err);
                this.toastService.error(`Failed to load alerts. Please try again.`);
            }
        });
    }

    onPageChange(newPageIndex: number) {
        this.pageIndex = newPageIndex;
        this.loadAlerts();
    }

    groupAlertsByCustomer(alerts: Alert[]) {
        if (!Array.isArray(alerts)) {
            this.customers = [];
            return;
        }

        const grouped = alerts.reduce((acc: Record<string, UniqueCustomer>, alert: Alert) => {
            const customerNumber = alert.customer_number || 'Unknown';
            if (!acc[customerNumber]) {
                acc[customerNumber] = {
                    customer_number: customerNumber,
                    totalWeight: 0,
                    alertCount: 0,
                    alerts: []
                };
            }
            acc[customerNumber].totalWeight += alert.weight || 0;
            acc[customerNumber].alertCount++;
            acc[customerNumber].alerts.push(alert);
            return acc;
        }, {} as Record<string, UniqueCustomer>);

        this.customers = Object.values(grouped);
    }

    mapAssignmentsToCustomers(assignments: AssignmentResponseDto[]) {
        if (!Array.isArray(assignments)) {
            this.customers = [];
            return;
        }

        this.customers = assignments.map(assignment => ({
            customer_number: assignment.customerResponseDto?.customerNumber || 'Unknown',
            totalWeight: assignment.riskScore || 0,
            alertCount: assignment.customerResponseDto?.alerts?.length || 0,
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
                this.toastService.success(`Successfully assigned customer ${this.selectedCustomerNumber} to ${email}`);
            },
            error: (err: any) => {
                console.error('Assignment failed', err);
                this.toastService.error('Failed to assign customer.');
            }
        });
    }
}
