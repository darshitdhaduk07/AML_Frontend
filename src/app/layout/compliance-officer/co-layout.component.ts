import { Component, inject } from '@angular/core';
import {
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationPanelComponent } from '../../shared/components/notification-panel/notification-panel.component';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-compliance-officer-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationPanelComponent, CommonModule],
    templateUrl: './co-layout.component.html',
    styleUrls: ['./co-layout.component.css'],
})
export class ComplianceOfficerLayoutComponent {
    private notificationService = inject(NotificationService);
    private authService = inject(AuthService);
    private router = inject(Router);

    isNotificationOpen = false;
    unreadCount$ = this.notificationService.unreadCount$;

    toggleNotifications() {
        this.isNotificationOpen = !this.isNotificationOpen;
    }

    getPageTitle(): string {
        const url = this.router.url;
        if (url.includes('alerts/customer')) return 'Customer Details';
        if (url.includes('alerts')) return 'Assigned Alerts';
        if (url.includes('cases')) return 'Investigation Cases';
        return 'Investigation';
    }

    /**
     * SRS 3.3.1: Session Management for CO
     * Ensures investigation audit logs record the system exit.
     */
    logout() {
        this.authService.logout().subscribe({
            next: () => this.router.navigate(['/admin/login']),
            error: () => this.router.navigate(['/admin/login'])
        });
    }
}
