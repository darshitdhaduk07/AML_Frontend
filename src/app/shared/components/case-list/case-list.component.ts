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
    templateUrl: './case-list.component.html',
    styleUrl: './case-list.component.css'
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

    closeCase(caseId: string) {
        if (confirm('Are you sure you want to close this case?')) {
            this.dataService.closeCase(caseId).subscribe({
                next: () => {
                    this.toastService.success('Case closed successfully');
                    this.loadCases();
                },
                error: (err) => this.toastService.error('Failed to close case')
            });
        }
    }
}
