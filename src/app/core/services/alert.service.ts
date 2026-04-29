import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Alert {
    active: boolean;
    customer_number: string;
    group_id: string;
    ruleDescription: string;
    ruleCode: string;
    transaction_number: string;
    weight: number;
}

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAlerts(): Observable<Alert[]> {
        return this.http.get<Alert[]>(`${this.apiUrl}/api/v1/rules/alerts`);
    }
}
