import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlertService, Alert, AssignmentResponseDto } from '../../../core/services/alert.service';
import { DataService } from '../../../core/services/data.service';
import { FormsModule } from '@angular/forms';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { ToastService } from '../../../core/services/toast.service';

interface GroupedAlerts {
    group_id: string;
    alerts: Alert[];
}

@Component({
    selector: 'app-customer-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './customer-detail.component.html',
    styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent implements OnInit {
    @Input() role: 'ADMIN' | 'OFFICER' = 'ADMIN';

    private route = inject(ActivatedRoute);
    private alertService = inject(AlertService);
    private dataService = inject(DataService);
    private toastService = inject(ToastService);
    
    customerNumber: string = '';
    groupedAlerts: GroupedAlerts[] = [];
    totalWeight: number = 0;
    loading = true;
    hasOpenCases = false;

    // Case Creation State
    showCaseModal = false;
    newCase = {
        caseName: '',
        caseDescription: ''
    };

    ngOnInit() {
        const routeRole = this.route.snapshot.data['role'];
        if (routeRole) this.role = routeRole;
        
        this.customerNumber = this.route.snapshot.paramMap.get('customerNumber') || '';
        this.loadCustomerAlerts();
        this.checkOpenCases();
    }

    loadCustomerAlerts() {
        this.loading = true;
        this.alertService.getCustomerAlerts(this.customerNumber).subscribe({
            next: (data: Alert[]) => {
                this.processAlerts(data || []);
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Error loading details:', err);
                this.loading = false;
            }
        });
    }

    processAlerts(data: Alert[]) {
        const customerAlerts = data;
        
        // Backend already filters for active=true; sum all non-false-positive alerts
        this.totalWeight = customerAlerts
            .filter(a => a.falsePositive !== true)
            .reduce((sum: number, a: Alert) => sum + (a.weight || 0), 0);
        
        const groups = customerAlerts.reduce((acc: Record<string, Alert[]>, alert: Alert) => {
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
    }



    getRiskColor(weight: number): string {
        if (weight > 70) return '#ef4444'; // Red
        if (weight > 30) return '#f59e0b'; // Yellow
        return '#10b981'; // Green
    }

    markAsFalsePositive(brokenRuleId: string) {
        if (confirm('Are you sure you want to mark this alert as a False Positive? This will exclude it from risk calculations.')) {
            this.dataService.markFalsePositive(brokenRuleId).subscribe({
                next: (resp) => {
                    this.toastService.success('Alert marked as False Positive');
                    this.loadCustomerAlerts(); // Reload to see changes
                },
                error: (err) => {
                    console.error('Failed to mark false positive', err);
                    this.toastService.error('Failed to mark False Positive');
                }
            });
        }
    }

    checkOpenCases() {
        this.dataService.hasOpenCases(this.customerNumber).subscribe({
            next: (hasOpen: boolean) => {
                this.hasOpenCases = hasOpen;
            },
            error: (err: any) => {
                console.error('Error checking open cases:', err);
                this.hasOpenCases = false;
            }
        });
    }

    submitCase() {
        const payload = {
            ...this.newCase,
            customerNumber: this.customerNumber
        };

        this.dataService.createCase(payload).subscribe({
            next: (resp: string) => {
                this.toastService.success('Case created successfully');
                this.showCaseModal = false;
                this.newCase = { caseName: '', caseDescription: '' };
                this.checkOpenCases();
            },
            error: (err: any) => {
                console.error('Error creating case:', err);
                this.toastService.error('Failed to create case.');
            }
        });
    }
}
