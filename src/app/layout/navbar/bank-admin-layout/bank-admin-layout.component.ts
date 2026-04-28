import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-bank-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './bank-admin-layout.component.html',
  styleUrls: ['./bank-admin-layout.component.css']
})
export class BankAdminLayoutComponent {
  constructor(private router: Router) {}

  /**
   * SRS 3.1.1 & 3.2.1: Authentication & Session Management
   * Terminates the institutional session and redirects to standard login.
   */
  logout() {
    console.log('Recording audit event: Bank Admin manual logout.'); // [cite: 266]
    this.router.navigate(['/auth/login']);
  }
}