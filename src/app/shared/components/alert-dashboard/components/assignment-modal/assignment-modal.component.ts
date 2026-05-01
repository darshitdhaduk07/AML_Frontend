import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../core/services/data.service';
import { ComplianceOfficerResponseDto } from '../../../../../shared/models/compliance-officer.dto';

@Component({
    selector: 'app-assignment-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="modal-overlay" (click)="onClose()">
            <div class="modal-content" (click)="$event.stopPropagation()">
                <div class="modal-header">
                    <h2>Assign Investigation</h2>
                    <p>Select a Compliance Officer for Customer: <strong>{{ customerNumber }}</strong></p>
                    <button class="close-btn" (click)="onClose()">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="search-container">
                        <span class="material-symbols-outlined">search</span>
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="Search by email..." 
                            [(ngModel)]="searchQuery"
                        />
                    </div>

                    <div *ngIf="loading" class="empty-state">
                        <div class="loading-spinner"></div>
                        <p>Loading officers...</p>
                    </div>

                    <div *ngIf="!loading && filteredOfficers.length > 0" class="officers-list">
                        <div 
                            *ngFor="let officer of filteredOfficers" 
                            class="officer-item"
                            (click)="onSelect(officer)"
                        >
                            <div class="officer-avatar">
                                {{ officer.email.charAt(0).toUpperCase() }}
                            </div>
                            <div class="officer-info">
                                <div class="officer-email">{{ officer.email }}</div>
                                <div class="officer-status" [ngClass]="officer.isLocked || officer.isSuspended ? 'status-locked' : 'status-active'">
                                    {{ officer.isLocked || officer.isSuspended ? 'Unavailable' : 'Available' }}
                                </div>
                            </div>
                            <span class="material-symbols-outlined" style="color: #cbd5e1">chevron_right</span>
                        </div>
                    </div>

                    <div *ngIf="!loading && filteredOfficers.length === 0" class="empty-state">
                        <span class="material-symbols-outlined">person_search</span>
                        <p>No officers found matching "{{ searchQuery }}"</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrl: './assignment-modal.component.css'
})
export class AssignmentModalComponent implements OnInit {
    @Input() customerNumber: string = '';
    @Output() close = new EventEmitter<void>();
    @Output() select = new EventEmitter<string>();

    private dataService = inject(DataService);

    officers: ComplianceOfficerResponseDto[] = [];
    searchQuery: string = '';
    loading: boolean = true;

    ngOnInit(): void {
        this.loadOfficers();
    }

    loadOfficers(): void {
        this.loading = true;
        this.dataService.getComplianceOfficers().subscribe({
            next: (data: ComplianceOfficerResponseDto[]) => {
                this.officers = data;
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Failed to load compliance officers', err);
                this.loading = false;
            }
        });
    }

    get filteredOfficers(): ComplianceOfficerResponseDto[] {
        return this.officers.filter((officer: ComplianceOfficerResponseDto) => 
            officer.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    onSelect(officer: ComplianceOfficerResponseDto): void {
        if (officer.isLocked || officer.isSuspended) {
            alert('This officer is currently unavailable.');
            return;
        }
        this.select.emit(officer.email);
    }

    onClose(): void {
        this.close.emit();
    }
}
