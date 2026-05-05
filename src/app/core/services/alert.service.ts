import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../../shared/models/paginated-response';

export interface Alert {
    active: boolean;
    customer_number: string;
    group_id: string;
    ruleDescription: string;
    ruleCode: string;
    ruleType?: string;
    transaction?: TransactionDto;
    transaction_number?: string;
    weight: number;
    id?: string;
    brokenRuleId?: string;
    falsePositive: boolean;
}

export interface TransactionDto {
    IFSC: string;
    account: string;
    accountType: string;
    amount: number;
    country: string;
    direction: string;
    transactionNumber: string;
    txnTime: string;
    txnType: string;
}

export interface CustomerResponseDto {
    customerNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    occupation: string;
    income: number;
    netWorth: number;
    nationalityCountry: string;
    countryOfBirth: string;
    familyCode: string;
    riskScore: number;
}

export interface AssignmentResponseDto {
    customerResponseDto: CustomerResponseDto;
    alerts: Alert[];
    isOpen: boolean;
    riskScore: number;
}

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAlerts(page: number = 0, size: number = 10): Observable<PaginatedResponse<CustomerResponseDto>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<CustomerResponseDto>>(`${this.apiUrl}/api/v1/rules/alerts`, { params });
    }

    getAllAlerts(page: number = 0, size: number = 10): Observable<PaginatedResponse<Alert>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<Alert>>(`${this.apiUrl}/api/v1/rules/alerts/all`, { params });
    }

    getAssignments(page: number = 0, size: number = 10): Observable<PaginatedResponse<AssignmentResponseDto>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<AssignmentResponseDto>>(`${this.apiUrl}/api/v1/investigation/assignments`, { params });
    }

    getCustomerAlerts(customerNumber: string): Observable<Alert[]> {
        return this.http.get<Alert[]>(`${this.apiUrl}/api/v1/rules/alerts/customer/${customerNumber}`);
    }
}
