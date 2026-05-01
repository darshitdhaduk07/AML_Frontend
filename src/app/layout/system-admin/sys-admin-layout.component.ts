import { Component } from '@angular/core';
import {
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-system-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './sys-admin-layout.component.html',
    styleUrls: ['./sys-admin-layout.component.css'],
})
export class SystemAdminLayoutComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    // This mirrors the "Administration Layer" requirement from the SRS [cite: 48]
    adminName: string = 'System Super Admin';

    getPageTitle(): string {
        const url = this.router.url;
        if (url.includes('dashboard')) return 'System Overview';
        if (url.includes('rule-engine')) return 'Rule Management';
        if (url.includes('bank-registry')) return 'Bank Onboarding';
        if (url.includes('reports')) return 'Global Reports';
        return 'Control Panel';
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/admin/login']);
            },
            error: () => {
                this.router.navigate(['/admin/login']);
            }
        });
    }
}
