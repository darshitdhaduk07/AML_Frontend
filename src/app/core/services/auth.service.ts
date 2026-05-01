import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { LoginResponse } from '../../shared/models/auth.dto';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly AUTH_TOKEN_KEY = 'auth_token';
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private storageService = inject(StorageService);

    /**
     * Performs login and saves the JWT token upon success.
     */
    login(credentials: any, bankName: string, isSystemAdmin: boolean): Observable<LoginResponse> {
        const apiPayload = isSystemAdmin
            ? {
                  role: 'SYSTEM_ADMIN',
                  email: credentials.email,
                  password: credentials.password,
              }
            : {
                  tenant: bankName,
                  role: credentials.role,
                  email: credentials.email,
                  password: credentials.password,
              };

        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, apiPayload).pipe(
            tap((response) => {
                if (response?.jwt) {
                    this.storageService.setCookie(
                        this.AUTH_TOKEN_KEY,
                        response.jwt,
                    );
                }
            }),
        );
    }

    /**
     * Returns the stored JWT token.
     */
    getToken(): string | null {
        return this.storageService.getCookie(this.AUTH_TOKEN_KEY);
    }

    /**
     * Returns HttpHeaders with Authorization token if available.
     */
    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        const token = this.getToken();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

    /**
     * Decodes the JWT and returns the user role.
     * Note: In a real app, use a library like 'jwt-decode'.
     */
    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || null;
        } catch (e) {
            console.error('Failed to decode JWT:', e);
            return null;
        }
    }

    /**
     * Verifies the current token with the backend.
     */
    verifyToken(): Observable<boolean> {
        const token = this.getToken();
        if (!token) return of(false);

        // Assuming the backend expects the JWT in the body or it's sent automatically via cookies/interceptors
        return this.http
            .post<boolean>(`${this.apiUrl}/api/v1/auth/verify`, {
                auth_token: token,
            })
            .pipe(
                tap((isValid) => {
                    if (!isValid) {
                        this.logout();
                    }
                }),
            );
    }

    /**
     * Checks if a user is authenticated.
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Clears session and logs out.
     */
    logout(): Observable<any> {
        const token = this.getToken();
        if (!token) {
            this.storageService.deleteCookie(this.AUTH_TOKEN_KEY);
            return of(null);
        }

        return this.http.post(`${this.apiUrl}/api/v1/auth/logout`, {}, { 
            headers: this.getHeaders(),
            responseType: 'text' 
        }).pipe(
            // Use finalize to ensure cookie is deleted even if request fails
            tap({
                next: () => this.storageService.deleteCookie(this.AUTH_TOKEN_KEY),
                error: () => this.storageService.deleteCookie(this.AUTH_TOKEN_KEY)
            })
        );
    }
}
