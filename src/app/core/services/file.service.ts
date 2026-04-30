import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private readonly apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    uploadFile(file: File, type: string): Observable<string> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        const endpoint = `${this.apiUrl}/api/files/${type.toLowerCase()}`;

        return this.http.post(endpoint, formData, {
            headers: this.authService.getHeaders(),
            responseType: 'text',
        });
    }
}
