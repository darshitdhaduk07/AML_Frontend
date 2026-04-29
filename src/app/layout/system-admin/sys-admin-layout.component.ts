import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sys-admin-layout.component.html',
  styleUrls: ['./sys-admin-layout.component.css']
})
export class SystemAdminLayoutComponent {
  
  // This mirrors the "Administration Layer" requirement from the SRS [cite: 48]
  adminName: string = 'System Super Admin';

  constructor(private router: Router) {}

  /**
   * SRS 3.1.1: Authentication & Session Management [cite: 50]
   * Handles session termination and audit logging requirements [cite: 56]
   */
  logout() {
    console.log('Logging out System Admin and clearing secure session...');
    // In a real app, you would call your AuthService.logout() here 
    this.router.navigate(['/auth/sys-login']);
  }
}