import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-rule-registration',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './rule-registration.component.html',
    styleUrl: './rule-registration.component.css',
})
export class RuleRegistrationComponent {}
