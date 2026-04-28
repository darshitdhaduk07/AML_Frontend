import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tenant-form.component.html',
  styleUrls: ['../shared-reg-styles.css']
})
export class TenantFormComponent {
  regForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.regForm = this.fb.group({
      tenantName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.regForm.valid) console.log('Tenant Data:', this.regForm.value);
  }
}