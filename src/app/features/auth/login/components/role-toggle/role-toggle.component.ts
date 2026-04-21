import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-role-toggle',
  standalone: true,
  imports: [],
  templateUrl: './role-toggle.component.html',
  styleUrl: './role-toggle.component.css'
})
export class RoleToggleComponent {
  @Input() selectedRole: string = 'BANK_ADMIN';
  @Output() roleChange = new EventEmitter<string>();

  selectRole(role: string) {
    this.selectedRole = role;
    this.roleChange.emit(role);
  }
}
