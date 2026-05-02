import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="paginator-container">
      <div class="paginator-info">
        Showing {{ length === 0 ? 0 : (pageIndex * pageSize) + 1 }} to {{ Math.min((pageIndex + 1) * pageSize, length) }} of {{ length }} results
      </div>
      <div class="paginator-actions">
        <button 
          class="paginator-btn" 
          [disabled]="pageIndex === 0" 
          (click)="onPageChange(pageIndex - 1)"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        
        <div class="page-numbers">
          <button 
            *ngFor="let page of getVisiblePages()" 
            class="page-num-btn" 
            [class.active]="page === pageIndex"
            (click)="onPageChange(page)"
          >
            {{ page + 1 }}
          </button>
        </div>

        <button 
          class="paginator-btn" 
          [disabled]="pageIndex >= totalPages - 1" 
          (click)="onPageChange(pageIndex + 1)"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .paginator-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: white;
      border-top: 1px solid #f1f5f9;
      color: #64748b;
      font-size: 0.875rem;
    }

    .paginator-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .paginator-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
    }

    .paginator-btn:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .paginator-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 4px;
    }

    .page-num-btn {
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: #475569;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .page-num-btn:hover:not(.active) {
      background: #f1f5f9;
    }

    .page-num-btn.active {
      background: #6366f1;
      color: white;
      border-color: #6366f1;
    }

    .material-symbols-outlined {
      font-size: 20px;
    }
  `]
})
export class PaginatorComponent {
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Output() page = new EventEmitter<number>();

  Math = Math;

  get totalPages(): number {
    return Math.ceil(this.length / this.pageSize);
  }

  onPageChange(newPageIndex: number) {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.page.emit(newPageIndex);
    }
  }

  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.pageIndex;
    const pages: number[] = [];
    
    let start = Math.max(0, current - 2);
    let end = Math.min(total, start + 5);
    
    if (end - start < 5) {
      start = Math.max(0, end - 5);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
