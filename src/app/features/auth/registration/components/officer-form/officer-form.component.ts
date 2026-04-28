import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-officer-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './officer-form.component.html',
  styleUrls: ['../shared-reg-styles.css']
})
export class OfficerFormComponent {
  offForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.offForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // New: Individual booleans for Maker and Checker
      isMaker: [false],
      isChecker: [false]
    }, { validators: this.atLeastOneRequired }); // Custom validator
  }

  // Custom Validator: Ensures at least one checkbox is checked
  atLeastOneRequired(group: FormGroup) {
    const maker = group.get('isMaker')?.value;
    const checker = group.get('isChecker')?.value;
    return (maker || checker) ? null : { noneSelected: true };
  }

  onSubmit() {
    if (this.offForm.valid) {
      console.log('Officer Registration Data:', this.offForm.value);
    }
  }
}