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
    selector: 'app-bank-admin-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationPanelComponent, CommonModule],
    templateUrl: './bank-admin-layout.component.html',
    styleUrls: ['./bank-admin-layout.component.css'],
})
export class BankAdminLayoutComponent {
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
        if (url.includes('dashboard')) return 'Alert Dashboard';
        if (url.includes('upload')) return 'Batch Upload';
        if (url.includes('user-management')) return 'User Management';
        if (url.includes('cases')) return 'Case Tracking';
        if (url.includes('reports')) return 'Reports';
        if (url.includes('alerts/customer')) return 'Customer Details';
        return 'Overview';
    }

    /**
     * SRS 3.1.1 & 3.2.1: Authentication & Session Management
     * Terminates the institutional session and redirects to standard login.
     */
    logout() {
        this.authService.logout().subscribe({
            next: () => this.router.navigate(['/admin/login']),
            error: () => this.router.navigate(['/admin/login'])
        });
    }
}
