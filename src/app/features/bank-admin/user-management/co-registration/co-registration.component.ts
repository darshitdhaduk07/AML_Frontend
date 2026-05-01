import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-co-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './co-registration.component.html',
  styleUrl: './co-registration.component.css'
})
export class CoRegistrationComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);

  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isSubmitting = false;

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      const email = this.registrationForm.value.email as string;

      this.dataService.registerComplianceOfficer(email).subscribe({
        next: (response) => {
          alert(response || 'Compliance Officer registered successfully');
          this.registrationForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          alert(err.error || 'Failed to register Compliance Officer');
          this.isSubmitting = false;
        }
      });
    }
  }
}
