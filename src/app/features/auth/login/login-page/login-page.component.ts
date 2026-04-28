import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthBrandingComponent } from '../components/auth-branding/auth-branding.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, AuthBrandingComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  @Input() bankName: string = '';
  @Input() isSystemAdmin: boolean = false;

  private authService = inject(AuthService);

  get effectiveBankName(): string {
    return this.isSystemAdmin ? 'GOVERNANCE LAYER' : this.bankName;
  }

  handleLogin(credentials: any) {
    const apiPayload = this.isSystemAdmin 
      ? {
          role: 'SYSTEM_ADMIN',
          email: credentials.email,
          password: credentials.password
        }
      : {
          tenant: this.bankName,
          role: credentials.role,
          email: credentials.email,
          password: credentials.password
        };
    
    const requestType = this.isSystemAdmin ? 'System Admin' : 'Tenant';
    console.log(`Sending ${requestType} Login Request:`, apiPayload);

    this.authService.login(apiPayload).subscribe({
      next: (response) => {
        console.log('Login successful', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}