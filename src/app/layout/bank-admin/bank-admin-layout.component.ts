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

@Component({
    selector: 'app-bank-admin-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationPanelComponent, CommonModule],
    templateUrl: './bank-admin-layout.component.html',
    styleUrls: ['./bank-admin-layout.component.css'],
})
export class BankAdminLayoutComponent {
    private notificationService = inject(NotificationService);
    isNotificationOpen = false;
    unreadCount$ = this.notificationService.unreadCount$;

    constructor(private router: Router) {}

    toggleNotifications() {
        this.isNotificationOpen = !this.isNotificationOpen;
    }

    /**
     * SRS 3.1.1 & 3.2.1: Authentication & Session Management
     * Terminates the institutional session and redirects to standard login.
     */
    logout() {
        console.log('Recording audit event: Bank Admin manual logout.'); // [cite: 266]
        this.router.navigate(['/admin/login']);
    }
}
