import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoRegistrationComponent } from './co-registration/co-registration.component';
import { CoListComponent } from './co-list/co-list.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, CoRegistrationComponent, CoListComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  viewMode: 'register' | 'manage' = 'register';
}
