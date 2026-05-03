import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TenantDto } from '../../../../shared/models/tenant.dto';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';

@Component({
  selector: 'app-existing-rules',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './existing-rules.component.html',
  styleUrl: './existing-rules.component.css'
})
export class ExistingRulesComponent implements OnInit {
  private dataService = inject(DataService);
  private toastService = inject(ToastService);

  public tenants: TenantDto[] = [];
  public expandedTenants: Set<string> = new Set();
  public tenantRules: Map<string, any[]> = new Map();
  public loadingTenants: Set<string> = new Set();
  
  // Pagination per tenant
  public tenantPagination: Map<string, { pageIndex: number, pageSize: number, totalElements: number }> = new Map();

  ngOnInit(): void {
    this.dataService.getTenants(0, 100).subscribe({
      next: (response) => {
        this.tenants = response.content;
      },
      error: (error) => {
        console.error('Failed to fetch tenants', error);
        this.toastService.error('Failed to fetch tenants');
      }
    });
  }

  toggleTenant(tenantName: string): void {
    if (this.expandedTenants.has(tenantName)) {
      this.expandedTenants.delete(tenantName);
    } else {
      this.expandedTenants.add(tenantName);
      if (!this.tenantRules.has(tenantName)) {
        this.tenantPagination.set(tenantName, { pageIndex: 0, pageSize: 5, totalElements: 0 });
        this.fetchRules(tenantName);
      }
    }
  }

  fetchRules(tenantName: string): void {
    const pagination = this.tenantPagination.get(tenantName) || { pageIndex: 0, pageSize: 5, totalElements: 0 };
    this.loadingTenants.add(tenantName);
    this.dataService.getRulesByTenant(tenantName, pagination.pageIndex, pagination.pageSize).subscribe({
      next: (response: PaginatedResponse<any>) => {
        this.tenantRules.set(tenantName, response.content);
        pagination.totalElements = response.totalElements;
        this.tenantPagination.set(tenantName, pagination);
        this.loadingTenants.delete(tenantName);
      },
      error: (error) => {
        console.error(`Failed to fetch rules for ${tenantName}`, error);
        this.toastService.error(`Failed to fetch rules for ${tenantName}`);
        this.loadingTenants.delete(tenantName);
      }
    });
  }

  onPageChange(tenantName: string, newPageIndex: number): void {
    const pagination = this.tenantPagination.get(tenantName);
    if (pagination) {
      pagination.pageIndex = newPageIndex;
      this.tenantPagination.set(tenantName, pagination);
      this.fetchRules(tenantName);
    }
  }

  getPagination(tenantName: string) {
    return this.tenantPagination.get(tenantName);
  }

  isExpanded(tenantName: string): boolean {
    return this.expandedTenants.has(tenantName);
  }

  getRules(tenantName: string): any[] {
    return this.tenantRules.get(tenantName) || [];
  }

  isLoading(tenantName: string): boolean {
    return this.loadingTenants.has(tenantName);
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  deleteRule(tenantName: string, selectedRuleId: string): void {
    if (confirm('Are you sure you want to delete this rule?')) {
      this.dataService.deleteRule(tenantName, selectedRuleId).subscribe({
        next: () => {
          this.toastService.success('Rule deleted successfully');
          this.fetchRules(tenantName);
        },
        error: (error) => {
          console.error(`Failed to delete rule ${selectedRuleId} for ${tenantName}`, error);
          this.toastService.error('Failed to delete rule');
        }
      });
    }
  }
}
