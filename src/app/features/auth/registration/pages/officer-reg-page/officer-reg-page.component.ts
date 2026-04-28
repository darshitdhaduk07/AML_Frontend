import { Component } from '@angular/core';
import { TenantFormComponent } from '../../components/tenant-form/tenant-form.component';
import { OfficerFormComponent } from '../../components/officer-form/officer-form.component';

@Component({
  standalone: true,
  imports: [OfficerFormComponent],
  template: `<app-officer-form></app-officer-form>`,
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
export class OfficerRegPageComponent {}