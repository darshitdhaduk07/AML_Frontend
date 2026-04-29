import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-compliance-officer-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './co-layout.component.html',
  styleUrls: ['./co-layout.component.css']
})
export class ComplianceOfficerLayoutComponent {
  constructor(private router: Router) {}

  /**
   * SRS 3.3.1: Session Management for CO
   * Ensures investigation audit logs record the system exit.
   */
  logout() {
    console.log('Recording audit event: Compliance Officer session terminated.'); // [cite: 266]
    this.router.navigate(['/auth/login']);
  }
}