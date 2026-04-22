import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleToggleComponent } from '../role-toggle/role-toggle.component';
import { AuthFooterComponent } from '../auth-footer/auth-footer.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RoleToggleComponent, AuthFooterComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {
  @Input() isSystemAdmin: boolean = false;
  @Output() loginSubmit = new EventEmitter<any>();
  
  loginForm: FormGroup;
  
  // NEW: State variable to track visibility
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      role: ['BANK_ADMIN', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.isSystemAdmin) {
      this.loginForm.patchValue({ role: 'SYSTEM_ADMIN' });
    }
  }

  onRoleChange(role: string) {
    this.loginForm.patchValue({ role });
  }

  // NEW: Function to flip the boolean true/false
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginSubmit.emit(this.loginForm.value);
    }
  }
}