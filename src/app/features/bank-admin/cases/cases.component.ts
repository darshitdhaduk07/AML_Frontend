import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';

@Component({
    selector: 'app-cases',
    standalone: true,
    imports: [CommonModule, FormsModule, PaginatorComponent],
    templateUrl: './cases.component.html',
    styleUrl: './cases.component.css'
})
export class CasesComponent implements OnInit {
    private dataService: DataService = inject(DataService);
    private router = inject(Router);

    cases: any[] = [];
    loading: boolean = true;
    
    selectedStatus: string = '';
    pageNumber: number = 0;
    pageSize: number = 10;
    totalElements: number = 0;

    statuses = [
        { label: 'All Cases', value: '' },
        { label: 'Open', value: 'OPEN' },
        { label: 'Escalated', value: 'ESCALATED' },
        { label: 'Closed', value: 'CLOSED' }
    ];

    ngOnInit(): void {
        this.loadCases();
    }

    loadCases(): void {
        this.loading = true;
        this.dataService.getCases(this.pageNumber, this.pageSize, this.selectedStatus || undefined).subscribe({
            next: (response: PaginatedResponse<any>) => {
                this.cases = response.content;
                this.totalElements = response.totalElements;
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Failed to load cases', err);
                this.loading = false;
            }
        });
    }

    onStatusChange(): void {
        this.pageNumber = 0;
        this.loadCases();
    }

    onPageChange(newPage: number): void {
        this.pageNumber = newPage;
        this.loadCases();
    }

    onViewDetails(customerNumber: string): void {
        this.router.navigate(['/bank/alerts/customer', customerNumber]);
    }

    onDownloadSar(caseId: string): void {
        this.dataService.downloadCaseReport(caseId).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `SAR_Report_${caseId}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err: any) => {
                console.error('Failed to download SAR report', err);
                // ErrorInterceptor will show the error toast
            }
        });
    }
}
