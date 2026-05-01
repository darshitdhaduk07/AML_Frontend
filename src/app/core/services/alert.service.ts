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
    ruleType?: string;
    transaction?: TransactionDto;
    transaction_number?: string;
    weight: number;
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
    alerts: Alert[];
}

export interface AssignmentResponseDto {
    customerResponseDto: CustomerResponseDto;
    isOpen: boolean;
    riskScore: number;
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

    getAssignments(): Observable<AssignmentResponseDto[]> {
        return this.http.get<AssignmentResponseDto[]>(`${this.apiUrl}/api/v1/investigation/assignments`);
    }
}
