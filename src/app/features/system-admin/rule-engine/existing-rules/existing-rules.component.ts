import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { TenantDto } from '../../../../shared/models/tenant.dto';

@Component({
  selector: 'app-existing-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './existing-rules.component.html',
  styleUrl: './existing-rules.component.css'
})
export class ExistingRulesComponent implements OnInit {
  private dataService = inject(DataService);

  public tenants: TenantDto[] = [];
  public expandedTenants: Set<string> = new Set();
  public tenantRules: Map<string, any[]> = new Map();
  public loadingTenants: Set<string> = new Set();

  ngOnInit(): void {
    this.dataService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      },
      error: (error) => {
        console.error('Failed to fetch tenants', error);
      }
    });
  }

  toggleTenant(tenantName: string): void {
    if (this.expandedTenants.has(tenantName)) {
      this.expandedTenants.delete(tenantName);
    } else {
      this.expandedTenants.add(tenantName);
      if (!this.tenantRules.has(tenantName)) {
        this.fetchRules(tenantName);
      }
    }
  }

  fetchRules(tenantName: string): void {
    this.loadingTenants.add(tenantName);
    this.dataService.getRulesByTenant(tenantName).subscribe({
      next: (rules) => {
        this.tenantRules.set(tenantName, rules);
        this.loadingTenants.delete(tenantName);
      },
      error: (error) => {
        console.error(`Failed to fetch rules for ${tenantName}`, error);
        this.loadingTenants.delete(tenantName);
      }
    });
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
}
