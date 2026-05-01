import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toastService.toasts$ | async" 
        class="toast-item" 
        [ngClass]="'toast-' + toast.type"
      >
        <div class="toast-icon">
          <span class="material-symbols-outlined">{{ getIcon(toast.type) }}</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="toastService.remove(toast.id)">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      min-width: 320px;
      max-width: 450px;
      padding: 12px 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid transparent;
      animation: slideIn 0.3s cubic-bezier(0, 0, 0.2, 1);
      transition: all 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast-success {
      background-color: #f0fdf4;
      border-color: #bbf7d0;
      color: #166534;
    }
    .toast-success .toast-icon { color: #22c55e; }

    .toast-info {
      background-color: #eff6ff;
      border-color: #bfdbfe;
      color: #1e40af;
    }
    .toast-info .toast-icon { color: #3b82f6; }

    .toast-warning {
      background-color: #fffbeb;
      border-color: #fef3c7;
      color: #92400e;
    }
    .toast-warning .toast-icon { color: #f59e0b; }

    .toast-error {
      background-color: #fef2f2;
      border-color: #fecaca;
      color: #991b1b;
    }
    .toast-error .toast-icon { color: #ef4444; }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
    }

    .toast-close {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .toast-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #64748b;
    }

    .toast-close .material-symbols-outlined {
      font-size: 18px;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'cancel';
      default: return 'notifications';
    }
  }
}
