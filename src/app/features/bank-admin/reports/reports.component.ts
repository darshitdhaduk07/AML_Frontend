import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { AlertService, Alert } from '../../../core/services/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { AuthService } from '../../../core/services/auth.service';

import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, PaginatorComponent],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
    private dataService: DataService = inject(DataService);
    private alertService: AlertService = inject(AlertService);
    private authService: AuthService = inject(AuthService);
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    activeTab: string = 'flagged';
    
    flaggedTransactions: any[] = [];
    sarLogs: any[] = [];
    coPerformance: any[] = [];
    batchSummaries: any[] = [];
    loading: boolean = false;

    // Pagination for Flagged Transactions
    flaggedPage: number = 0;
    flaggedPageSize: number = 10;
    flaggedTotal: number = 0;

    // Date range for Flagged Transactions export
    startDate: string = '';
    endDate: string = '';

    ngOnInit(): void {
        this.loadFlaggedTransactions();
    }

    setTab(tab: string): void {
        this.activeTab = tab;
        if (tab === 'flagged' && this.flaggedTransactions.length === 0) this.loadFlaggedTransactions();
        if (tab === 'sar' && this.sarLogs.length === 0) this.loadSarLogs();
        if (tab === 'co' && this.coPerformance.length === 0) this.loadCoPerformance();
        if (tab === 'batch' && this.batchSummaries.length === 0) this.loadBatchSummaries();
    }

    loadFlaggedTransactions(): void {
        this.loading = true;
        this.alertService.getAlerts(this.flaggedPage, this.flaggedPageSize).subscribe({
            next: (resp: PaginatedResponse<Alert>) => {
                this.flaggedTransactions = resp.content;
                this.flaggedTotal = resp.totalElements;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    onPageChange(pageIndex: number): void {
        this.flaggedPage = pageIndex;
        this.loadFlaggedTransactions();
    }

    loadSarLogs(): void {
        this.loading = true;
        this.http.get<any[]>(`${this.apiUrl}/api/v1/reports/sar-logs`, { 
            headers: this.authService.getHeaders()
        }).subscribe({
            next: (data) => {
                console.log('SAR Logs received:', data);
                this.sarLogs = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load SAR logs:', err);
                this.loading = false;
            }
        });
    }

    loadCoPerformance(): void {
        this.loading = true;
        this.http.get<any[]>(`${this.apiUrl}/api/v1/reports/co-performance`, { 
            headers: this.authService.getHeaders()
        }).subscribe({
            next: (data) => {
                this.coPerformance = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    loadBatchSummaries(): void {
        this.loading = true;
        this.http.get<any[]>(`${this.apiUrl}/api/v1/reports/batch-summaries`, { 
            headers: this.authService.getHeaders()
        }).subscribe({
            next: (data) => {
                this.batchSummaries = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    downloadAlertPdf(): void {
        let url = `${this.apiUrl}/api/v1/reports/alert/pdf`;
        const params = [];
        if (this.startDate) params.push(`from=${this.startDate}T00:00:00`);
        if (this.endDate) params.push(`to=${this.endDate}T23:59:59`);
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        this.http.get(url, { headers: this.authService.getHeaders(), responseType: 'blob' }).subscribe(blob => {
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Alerts_Report_${this.startDate || 'all'}_to_${this.endDate || 'all'}.pdf`;
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
        });
    }

    downloadCasePdf(caseId: string): void {
        this.dataService.downloadCaseReport(caseId).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SAR_Report_${caseId}.pdf`;
            a.click();
        });
    }
}
