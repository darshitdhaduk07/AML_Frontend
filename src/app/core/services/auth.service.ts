import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  login(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        if (response && response.jwt) {
          this.storageService.setCookie('auth_token', response.jwt);
        }
      })
    );
  }

  getToken(): string | null {
    return this.storageService.getCookie('auth_token');
  }

  logout() {
    this.storageService.deleteCookie('auth_token');
  }
}
