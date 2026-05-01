import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../../core/services/data.service';
import { ToastService } from '../../../../core/services/toast.service';

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
  private toastService = inject(ToastService);

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
          this.toastService.success(response || 'Compliance Officer registered successfully');
          this.registrationForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          // ErrorInterceptor will handle the error toast
          this.isSubmitting = false;
        }
      });
    }
  }
}
