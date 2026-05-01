import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-bank-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './bank-onboarding.component.html',
  styleUrl: './bank-onboarding.component.css'
})
export class BankOnboardingComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  public onboardingForm: FormGroup;
  public isSubmitting = false;
  public successMessage: string | null = null;

  constructor() {
    this.onboardingForm = this.fb.group({
      tenantName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.onboardingForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;

    this.dataService.registerTenant(this.onboardingForm.value).subscribe({
      next: (response: string) => {
        this.successMessage = response;
        this.isSubmitting = false;
        this.onboardingForm.reset();
      },
      error: (error: any) => {
        console.error('Onboarding failed', error);
        alert('Failed to onboard bank: ' + (error.error?.message || 'Unknown error'));
        this.isSubmitting = false;
      }
    });
  }
}
