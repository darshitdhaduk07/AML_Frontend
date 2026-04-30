import { Component, EventEmitter, inject, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { InAppNotificationResponseDto } from '../../../core/models/notification.model';

@Component({
    selector: 'app-notification-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-panel.component.html',
    styleUrl: './notification-panel.component.css'
})
export class NotificationPanelComponent implements OnInit, OnChanges {
    private notificationService = inject(NotificationService);
    
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    
    notifications: InAppNotificationResponseDto[] = [];
    loading = false;

    ngOnInit() {
        this.loadNotifications();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
            this.loadNotifications();
        }
    }

    loadNotifications() {
        this.loading = true;
        this.notificationService.getNotifications().subscribe({
            next: (data) => {
                console.log('Fetched notifications:', data);
                this.notifications = data
                    .filter(n => {
                        const isRead = n.isRead === true || (n as any).read === true;
                        return !isRead;
                    })
                    .sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load notifications', err);
                this.loading = false;
            }
        });
    }

    markAsRead(id: string) {
        console.log('Marking as read, ID:', id);
        this.notificationService.markAsRead(id).subscribe({
            next: () => {
                console.log('Successfully marked as read in backend');
                this.notifications = this.notifications.filter(n => n.id !== id);
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
