import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, interval, startWith, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InAppNotificationResponseDto } from '../models/notification.model';
import { AuthService } from './auth.service';

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
                    return this.getNotifications();
                }
                return [];
            })
        ).subscribe();
    }

    /**
     * Fetches all notifications for the current user and updates unread count.
     */
    getNotifications(): Observable<InAppNotificationResponseDto[]> {
        const roleEndpoint = this.getRoleEndpoint();
        if (!roleEndpoint) return of([]);

        return this.http.get<InAppNotificationResponseDto[]>(`${this.apiUrl}/api/v1/notifications/${roleEndpoint}`).pipe(
            tap(notifications => {
                const count = notifications.filter(n => {
                    const isRead = n.isRead === true || (n as any).read === true;
                    return !isRead;
                }).length;
                this.unreadCountSubject.next(count);
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

    /**
     * Escalates a case.
     * @param caseId The ID of the case to escalate.
     */
    escalateCase(caseId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/api/v1/investigation/cases/${caseId}/escalate`, {});
    }

    /**
     * Files a SAR for a case.
     * @param caseId The ID of the case.
     */
    fileSar(caseId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/api/v1/investigation/cases/${caseId}/file-sar`, {});
    }
}
