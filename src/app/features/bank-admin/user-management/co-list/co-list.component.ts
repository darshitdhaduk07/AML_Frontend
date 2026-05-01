import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data.service';
import { ComplianceOfficerResponseDto } from '../../../../shared/models/compliance-officer.dto';

@Component({
  selector: 'app-co-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './co-list.component.html',
  styleUrl: './co-list.component.css'
})
export class CoListComponent implements OnInit {
  private dataService = inject(DataService);

  complianceOfficers: ComplianceOfficerResponseDto[] = [];
  filteredOfficers: ComplianceOfficerResponseDto[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;

  ngOnInit() {
    this.fetchOfficers();
  }

  fetchOfficers() {
    this.isLoading = true;
    this.dataService.getComplianceOfficers(0, 100).subscribe({
      next: (response) => {
        this.complianceOfficers = response.content;
        this.filterOfficers();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filterOfficers() {
    if (!this.searchQuery) {
      this.filteredOfficers = [...this.complianceOfficers];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredOfficers = this.complianceOfficers.filter(co => 
        co.email.toLowerCase().includes(query)
      );
    }
  }

  onSearchChange() {
    this.filterOfficers();
  }
}
