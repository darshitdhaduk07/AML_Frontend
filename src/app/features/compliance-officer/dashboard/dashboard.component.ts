import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDashboardComponent } from '../../../shared/components/alert-dashboard/dashboard.component';

@Component({
    selector: 'app-compliance-officer-dashboard',
    standalone: true,
    imports: [CommonModule, AlertDashboardComponent],
    template: `
        <app-alert-dashboard role="OFFICER"></app-alert-dashboard>
    `,
    styles: [],
})
export class ComplianceOfficerDashboardComponent {}
