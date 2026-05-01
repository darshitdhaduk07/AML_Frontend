import { Component, EventEmitter, inject, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { InAppNotificationResponseDto } from '../../../core/models/notification.model';
import { PaginatorComponent } from '../paginator/paginator.component';
import { PaginatedResponse } from '../../models/paginated-response';

@Component({
    selector: 'app-notification-panel',
    standalone: true,
    imports: [CommonModule, PaginatorComponent],
    templateUrl: './notification-panel.component.html',
    styleUrl: './notification-panel.component.css'
})
export class NotificationPanelComponent implements OnInit, OnChanges {
    private notificationService = inject(NotificationService);
    
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    
    notifications: InAppNotificationResponseDto[] = [];
    loading = false;

    // Pagination
    pageIndex = 0;
    pageSize = 5;
    totalElements = 0;

    ngOnInit() {
        this.loadNotifications();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
            this.pageIndex = 0; // Reset to first page when opening
            this.loadNotifications();
        }
    }

    loadNotifications() {
        this.loading = true;
        this.notificationService.getNotifications(this.pageIndex, this.pageSize).subscribe({
            next: (response: any) => {
                console.log('[NotificationPanel] Received response:', response);
                if (response && response.content && Array.isArray(response.content)) {
                    this.totalElements = response.totalElements || 0;
                    this.notifications = response.content;
                } else if (Array.isArray(response)) {
                    this.totalElements = response.length;
                    this.notifications = response;
                } else {
                    this.notifications = [];
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('[NotificationPanel] Failed to load notifications', err);
                this.loading = false;
            }
        });
    }

    onPageChange(newPageIndex: number) {
        this.pageIndex = newPageIndex;
        this.loadNotifications();
    }

    markAsRead(id: string) {
        this.notificationService.markAsRead(id).subscribe({
            next: () => {
                this.notifications = this.notifications.filter(n => n.id !== id);
                // If the current page becomes empty and there are more pages, go to prev or reload
                if (this.notifications.length === 0 && this.pageIndex > 0) {
                    this.pageIndex--;
                    this.loadNotifications();
                } else if (this.notifications.length === 0 && this.totalElements > 0) {
                    this.loadNotifications();
                }
            },
            error: (err) => {
                console.error('Failed to mark as read:', err);
            }
        });
    }

    onClose() {
        this.close.emit();
    }

    getIcon(type: string): string {
        switch (type) {
            case 'CASE_ASSIGNED': return 'assignment_ind';
            case 'CASE_ESCALATED': return 'trending_up';
            case 'SAR_FILED': return 'description';
            default: return 'notifications';
        }
    }

    getTypeClass(type: string): string {
        return type.toLowerCase().replace('_', '-');
    }
}
