import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthBrandingComponent } from '../components/auth-branding/auth-branding.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [CommonModule, AuthBrandingComponent, LoginFormComponent],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
    @Input() bankName: string = '';
    @Input() isSystemAdmin: boolean = false;

    private authService = inject(AuthService);
    private router = inject(Router);

    get effectiveBankName(): string {
        return this.isSystemAdmin ? 'GOVERNANCE LAYER' : this.bankName;
    }

    handleLogin(credentials: any) {
        this.authService.login(credentials, this.bankName, this.isSystemAdmin).subscribe({
            next: () => {
                const role = this.authService.getUserRole();
                this.redirectByRole(role);
            },
            error: (error) => {
                console.error('Login failed', error);
            },
        });
    }

    private redirectByRole(role: string | null) {
        switch (role) {
            case 'SYSTEM_ADMIN':
                this.router.navigate(['/sys/dashboard']);
                break;
            case 'BANK_ADMIN':
                this.router.navigate(['/bank/dashboard']);
                break;
            case 'COMPLIANCE_OFFICER':
                this.router.navigate(['/co/dashboard']);
                break;
            default:
                this.router.navigate(['/admin/login']);
        }
    }
}
