import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { TenantDto } from '../../shared/models/tenant.dto';
import { RuleTemplateDto } from '../../shared/models/rule-template.dto';
import { ComplianceOfficerResponseDto, ComplianceInvestigationAssignmentDto } from '../../shared/models/compliance-officer.dto';
import { PaginatedResponse } from '../../shared/models/paginated-response';

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

    getRulesByTenant(tenantName: string, page: number = 0, size: number = 10): Observable<PaginatedResponse<any>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<any>>(
            `${this.apiUrl}/api/v1/rules/${tenantName}`,
            { 
                headers: this.authService.getHeaders(),
                params 
            }
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

    markFalsePositive(brokenRuleId: string): Observable<string> {
        return this.http.put(
            `${this.apiUrl}/api/v1/investigation/mark-false-positive/${brokenRuleId}`,
            {},
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }

    escalateCase(caseId: string): Observable<string> {
        return this.http.put(
            `${this.apiUrl}/api/v1/investigation/cases/${caseId}/escalate`,
            {},
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }

    fileSar(caseId: string): Observable<string> {
        return this.http.put(
            `${this.apiUrl}/api/v1/investigation/cases/${caseId}/file-sar`,
            {},
            { 
                headers: this.authService.getHeaders(),
                responseType: 'text'
            }
        );
    }

    getCases(page: number = 0, size: number = 10): Observable<PaginatedResponse<any>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<any>>(
            `${this.apiUrl}/api/v1/investigation/cases`,
            { 
                headers: this.authService.getHeaders(),
                params 
            }
        );
    }
}
