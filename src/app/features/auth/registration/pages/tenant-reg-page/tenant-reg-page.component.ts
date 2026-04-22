import { Component } from '@angular/core';
import { TenantFormComponent } from '../../components/tenant-form/tenant-form.component';

@Component({
  standalone: true,
  imports: [TenantFormComponent],
  template: `<app-tenant-form></app-tenant-form>`,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
      background-color: #f8fafc;
    }
  `]
})
export class TenantRegPageComponent {}