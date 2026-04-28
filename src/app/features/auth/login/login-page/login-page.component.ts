import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthBrandingComponent } from '../components/auth-branding/auth-branding.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';

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
  }
}