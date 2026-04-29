import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInfoBoxComponent } from '../auth-info-box/auth-info-box.component';

@Component({
    selector: 'app-auth-branding',
    standalone: true,
    imports: [CommonModule, AuthInfoBoxComponent],
    templateUrl: './auth-branding.component.html',
    styleUrl: './auth-branding.component.css',
})
export class AuthBrandingComponent {
    @Input() bankName: string = '';
}
