import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, interval, startWith, switchMap, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InAppNotificationResponseDto } from '../models/notification.model';
import { AuthService } from './auth.service';
import { PaginatedResponse } from '../../shared/models/paginated-response';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor() {
        // Initial load and polling every 30 seconds if user is logged in
        interval(30000).pipe(
            startWith(0),
            switchMap(() => {
                if (this.authService.isAuthenticated()) {
                    return this.getNotifications(0, 50).pipe(
                        catchError(err => {
                            console.error('Notification polling failed', err);
                            return of(null);
                        })
                    );
                }
                return of(null);
            })
        ).subscribe();
    }

    /**
     * Fetches paginated notifications for the current user and updates unread count based on the current page.
     */
    getNotifications(page: number = 0, size: number = 10): Observable<PaginatedResponse<InAppNotificationResponseDto> | null> {
        const roleEndpoint = this.getRoleEndpoint();
        if (!roleEndpoint) return of(null);

        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<InAppNotificationResponseDto>>(`${this.apiUrl}/api/v1/notifications/${roleEndpoint}`, { params }).pipe(
            tap(response => {
                if (response) {
                    const content = response.content || (Array.isArray(response) ? response : null);
                    if (content && Array.isArray(content)) {
                        const count = content.filter(n => {
                            const isRead = n.isRead === true || (n as any).read === true;
                            return !isRead;
                        }).length;
                        if (page === 0) {
                            this.unreadCountSubject.next(count);
                        }
                    }
                }
            })
        );
    }

    private getRoleEndpoint(): string {
        const role = this.authService.getUserRole();
        if (role === 'BANK_ADMIN' || role === 'ROLE_BANK_ADMIN') return 'bank-admin';
        if (role === 'COMPLIANCE_OFFICER' || role === 'ROLE_COMPLIANCE_OFFICER') return 'compliance-officer';
        return '';
    }

    /**
     * Marks a specific notification as read.
     * @param id The UUID of the notification.
     */
    markAsRead(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/api/v1/notifications/${id}/read`, {}).pipe(
            tap(() => {
                const currentCount = this.unreadCountSubject.value;
                if (currentCount > 0) {
                    this.unreadCountSubject.next(currentCount - 1);
                }
            })
        );
    }

}
