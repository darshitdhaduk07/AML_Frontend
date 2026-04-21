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

  handleLogin(credentials: any) {
    const apiPayload = {
      tenant: this.bankName,
      role: credentials.role,
      email: credentials.email,
      password: credentials.password
    };
    console.log('Sending Tenant Login Request:', apiPayload);
  }
}