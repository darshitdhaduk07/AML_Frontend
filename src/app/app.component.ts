import { CommonModule } from '@angular/common';
import { ToastComponent } from './shared/components/toast/toast.component';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, ToastComponent],
    template: `
        <router-outlet></router-outlet>
        <app-toast></app-toast>
    `,
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'frontend';
}
