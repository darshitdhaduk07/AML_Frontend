import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthBrandingComponent } from '../components/auth-branding/auth-branding.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';

@Component({
  selector: 'app-sys-admin-login-page',
  standalone: true,
  imports: [CommonModule, AuthBrandingComponent, LoginFormComponent],
  templateUrl: './sys-admin-login-page.component.html',
  styleUrl: './sys-admin-login-page.component.css'
})
export class SysAdminLoginPageComponent {
  handleLogin(credentials: any) {
    const apiPayload = {
      role: 'SYSTEM_ADMIN',
      email: credentials.email,
      password: credentials.password
    };
    console.log('Sending System Admin Login Request:', apiPayload);
  }
}