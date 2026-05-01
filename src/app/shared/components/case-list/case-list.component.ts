import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { PaginatedResponse } from '../../../shared/models/paginated-response';

@Component({
    selector: 'app-case-list',
    standalone: true,
    imports: [CommonModule, PaginatorComponent],
    template: `
        <div class="cases-container">
            <div class="header">
                <h2>Investigation Cases</h2>
                <p>Manage and track formal investigation cases.</p>
            </div>

            <div class="cases-card">
                <div class="table-header">
                    <div class="header-item">Case Name</div>
                    <div class="header-item">Customer</div>
                    <div class="header-item">Status</div>
                    <div class="header-item" style="text-align: right">Actions</div>
                </div>

                <div *ngIf="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading cases...</p>
                </div>

                <div *ngIf="!loading && cases.length === 0" class="loading-state">
                    <p>No investigation cases found.</p>
                </div>

                <div *ngIf="!loading && cases.length > 0">
                    <div *ngFor="let case of cases" class="case-row">
                        <div class="case-info">
                            <span class="case-name">{{ case.caseName }}</span>
                            <span class="case-desc">{{ case.caseDescription }}</span>
                        </div>
                        
                        <div class="customer-info">
                            <span class="material-symbols-outlined">person</span>
                            {{ case.customerNumber }}
                        </div>

                        <div class="status-info">
                            <span class="status-badge" [class]="case.caseStatus.toLowerCase()">
                                {{ case.caseStatus }}
                            </span>
                            <span *ngIf="case.sarFiled" class="sar-badge">SAR FILED</span>
                        </div>

                        <div class="actions">
                            <button *ngIf="role === 'OFFICER' && case.caseStatus === 'OPEN'" 
                                    class="btn-action escalate" 
                                    (click)="escalate(case.id)">
                                <span class="material-symbols-outlined">trending_up</span>
                                Escalate
                            </button>
                            <button *ngIf="role === 'OFFICER' && !case.sarFiled" 
                                    class="btn-action sar" 
                                    (click)="fileSar(case.id)">
                                <span class="material-symbols-outlined">description</span>
                                File SAR
                            </button>
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
        </div>
    `,
    styles: [`
        .cases-container { padding: 24px; }
        .header { margin-bottom: 24px; }
        .header h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0; }
        .header p { color: #64748b; font-size: 14px; margin: 4px 0 0; }

        .cases-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .table-header { 
            display: grid; grid-template-columns: 2fr 1.5fr 1.5fr 2fr; 
            padding: 12px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
            font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;
        }

        .case-row { 
            display: grid; grid-template-columns: 2fr 1.5fr 1.5fr 2fr; 
            padding: 16px 24px; border-bottom: 1px solid #f1f5f9; align-items: center;
        }
        .case-row:last-child { border-bottom: none; }

        .case-info { display: flex; flex-direction: column; }
        .case-name { font-weight: 600; color: #1e293b; }
        .case-desc { font-size: 12px; color: #64748b; }

        .customer-info { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; }
        .customer-info .material-symbols-outlined { font-size: 18px; color: #94a3b8; }

        .status-info { display: flex; flex-direction: column; gap: 4px; }
        .status-badge { 
            font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 12px; width: fit-content;
            background: #f1f5f9; color: #475569;
        }
        .status-badge.open { background: #dcfce7; color: #166534; }
        .status-badge.escalated { background: #fef3c7; color: #92400e; }
        .sar-badge { font-size: 10px; font-weight: 800; color: #ef4444; }

        .actions { display: flex; justify-content: flex-end; gap: 8px; }
        .btn-action { 
            display: flex; align-items: center; gap: 4px; padding: 6px 12px; 
            border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
            border: 1px solid #e2e8f0; background: white; transition: all 0.2s;
        }
        .btn-action.escalate:hover { border-color: #f59e0b; color: #f59e0b; }
        .btn-action.sar:hover { border-color: #ef4444; color: #ef4444; }
        .btn-action .material-symbols-outlined { font-size: 16px; }

        .loading-state { padding: 48px; text-align: center; color: #64748b; }
        .loading-spinner { width: 32px; height: 32px; border: 3px solid #f1f5f9; border-top-color: #6366f1; border-radius: 50%; margin: 0 auto 12px; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    `]
})
export class CaseListComponent implements OnInit {
    @Input() role: 'ADMIN' | 'OFFICER' = 'ADMIN';

    private dataService = inject(DataService);
    private toastService = inject(ToastService);

    cases: any[] = [];
    loading = true;
    pageIndex = 0;
    pageSize = 5;
    totalElements = 0;

    ngOnInit() {
        this.loadCases();
    }

    loadCases() {
        this.loading = true;
        this.dataService.getCases(this.pageIndex, this.pageSize).subscribe({
            next: (response) => {
                this.cases = response.content || [];
                this.totalElements = response.totalElements;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load cases', err);
                this.loading = false;
            }
        });
    }

    onPageChange(newPageIndex: number) {
        this.pageIndex = newPageIndex;
        this.loadCases();
    }

    escalate(caseId: string) {
        if (confirm('Are you sure you want to escalate this case? This will notify the Bank Admin.')) {
            this.dataService.escalateCase(caseId).subscribe({
                next: () => {
                    this.toastService.success('Case escalated successfully');
                    this.loadCases();
                },
                error: (err) => this.toastService.error('Failed to escalate case')
            });
        }
    }

    fileSar(caseId: string) {
        if (confirm('Are you sure you want to file a SAR for this case?')) {
            this.dataService.fileSar(caseId).subscribe({
                next: () => {
                    this.toastService.success('SAR filed successfully');
                    this.loadCases();
                },
                error: (err) => this.toastService.error('Failed to file SAR')
            });
        }
    }
}
