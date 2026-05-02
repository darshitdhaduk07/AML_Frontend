import { Component } from '@angular/core';
import { AlertDashboardComponent } from '../../../shared/components/alert-dashboard/dashboard.component';

@Component({
    selector: 'app-co-assigned-alerts',
    standalone: true,
    imports: [AlertDashboardComponent],
    template: `<app-alert-dashboard role="OFFICER"></app-alert-dashboard>`
})
export class CoAssignedAlertsComponent {}
