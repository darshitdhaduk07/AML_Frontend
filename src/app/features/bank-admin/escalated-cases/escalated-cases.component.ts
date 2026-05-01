import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';

@Component({
    selector: 'app-escalated-cases',
    standalone: true,
    imports: [CommonModule, PaginatorComponent],
    templateUrl: './escalated-cases.component.html',
    styleUrl: './escalated-cases.component.css'
})
export class EscalatedCasesComponent implements OnInit {
    private dataService: DataService = inject(DataService);
    private router = inject(Router);

    cases: any[] = [];
    loading: boolean = true;
    
    pageNumber: number = 0;
    pageSize: number = 10;
    totalElements: number = 0;

    ngOnInit(): void {
        this.loadEscalatedCases();
    }

    loadEscalatedCases(): void {
        this.loading = true;
        this.dataService.getEscalatedCases(this.pageNumber, this.pageSize).subscribe({
            next: (response: PaginatedResponse<any>) => {
                this.cases = response.content;
                this.totalElements = response.totalElements;
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Failed to load escalated cases', err);
                this.loading = false;
            }
        });
    }

    onPageChange(newPage: number): void {
        this.pageNumber = newPage;
        this.loadEscalatedCases();
    }

    onViewDetails(customerNumber: string): void {
        this.router.navigate(['/bank/alerts/customer', customerNumber]);
    }
}
