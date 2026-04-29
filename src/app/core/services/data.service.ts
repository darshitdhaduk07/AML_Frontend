import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private http = inject(HttpClient);

    login(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
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
}
