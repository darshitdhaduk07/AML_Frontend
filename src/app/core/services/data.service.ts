import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { TenantDto } from '../../shared/models/tenant.dto';
import { RuleTemplateDto } from '../../shared/models/rule-template.dto';
import { ComplianceOfficerResponseDto, ComplianceInvestigationAssignmentDto } from '../../shared/models/compliance-officer.dto';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private readonly apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    getTenants(): Observable<TenantDto[]> {
        return this.http.get<TenantDto[]>(
            `${this.apiUrl}/api/v1/data/tenants`,
            { headers: this.authService.getHeaders() }
        );
    }

    getRuleTemplates(): Observable<RuleTemplateDto[]> {
        return this.http.get<RuleTemplateDto[]>(
            `${this.apiUrl}/api/v1/data/rule-templates`,
            { headers: this.authService.getHeaders() }
        );
    }

    createRule(ruleData: any): Observable<string> {
        return this.http.post(
            `${this.apiUrl}/api/v1/rules`,
            ruleData,
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }

    getRulesByTenant(tenantName: string): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.apiUrl}/api/v1/rules/${tenantName}`,
            { headers: this.authService.getHeaders() }
        );
    }

    registerTenant(tenantData: { tenantName: string, email: string }): Observable<string> {
        return this.http.post(
            `${this.apiUrl}/api/v1/auth/register/tenant`,
            tenantData,
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }

    getComplianceOfficers(): Observable<ComplianceOfficerResponseDto[]> {
        return this.http.get<ComplianceOfficerResponseDto[]>(
            `${this.apiUrl}/api/v1/data/compliance-officers`,
            { headers: this.authService.getHeaders() }
        );
    }

    assignInvestigation(assignment: ComplianceInvestigationAssignmentDto): Observable<string> {
        return this.http.post(
            `${this.apiUrl}/api/v1/investigation/assignments`,
            assignment,
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }

    createCase(caseData: { caseName: string, caseDiscription: string, customerNumber: string }): Observable<string> {
        return this.http.post(
            `${this.apiUrl}/api/v1/investigation/cases`,
            caseData,
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }

    registerComplianceOfficer(email: string): Observable<string> {
        return this.http.post(
            `${this.apiUrl}/api/v1/auth/register/co`,
            { email },
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }
}
