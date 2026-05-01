import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TenantDto } from '../../../../shared/models/tenant.dto';
import { RuleTemplateDto } from '../../../../shared/models/rule-template.dto';
import { RuleTemplateDropdownComponent } from './components/rule-template-dropdown/rule-template-dropdown.component';
import { ExistingRulesComponent } from '../existing-rules/existing-rules.component';

@Component({
    selector: 'app-rule-registration',
    standalone: true,
    imports: [CommonModule, RouterModule, RuleTemplateDropdownComponent, ReactiveFormsModule, ExistingRulesComponent],
    templateUrl: './rule-registration.component.html',
    styleUrl: './rule-registration.component.css',
})
export class RuleRegistrationComponent {

    private dataService = inject(DataService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private toastService = inject(ToastService);

    public tenants !: TenantDto[];
    public ruleTemplates !: RuleTemplateDto[];
    public selectedTemplate: RuleTemplateDto | null = null;
    public ruleForm: FormGroup;
    public viewMode: 'add' | 'list' = 'add';

    constructor() {
        this.ruleForm = this.fb.group({
            tenant: ['', Validators.required],
            weight: [1, [Validators.required, Validators.min(1)]],
            description: ['', Validators.required],
            parameters: this.fb.group({})
        });
    }

    ngOnInit(): void {
        this.dataService.getTenants(0, 100).subscribe({
            next: (response) => {
                this.tenants = response.content;
            },
            error: (error) => {
                console.error('Tenant Fetch failed', error);
            },
        });

        this.dataService.getRuleTemplates().subscribe({
            next: (templates) => {
                this.ruleTemplates = templates;
            },
            error: (error) => {
                console.error('Rule Template Fetch failed', error);
            },
        });
    }

    selectTemplate(template: RuleTemplateDto) {
        this.selectedTemplate = template;

        // Reset and rebuild dynamic parameters
        const paramsGroup = this.fb.group({});
        if (template.requiredParameters) {
            Object.keys(template.requiredParameters).forEach(key => {
                const meta = template.requiredParameters[key];
                const validators = [];
                if (meta.required) validators.push(Validators.required);
                if (meta.positive) validators.push(Validators.min(0));

                paramsGroup.addControl(key, this.fb.control('', validators));
            });
        }
        this.ruleForm.setControl('parameters', paramsGroup);
    }

    getParameterKeys(template: RuleTemplateDto | null): string[] {
        return (template && template.requiredParameters) ? Object.keys(template.requiredParameters) : [];
    }

    onSubmit() {
        const template = this.selectedTemplate;
        if (this.ruleForm.invalid || !template) {
            this.toastService.warning('Please fill all required fields correctly.');
            return;
        }

        const formValue = this.ruleForm.value;
        const processedParameters: any = {};

        // Cast parameters based on template metadata
        if (template.requiredParameters) {
            Object.keys(formValue.parameters).forEach(key => {
                const value = formValue.parameters[key];
                const type = template.requiredParameters[key].type || '';

                if (type.includes('Integer') || type.includes('Long') || type.includes('Short')) {
                    processedParameters[key] = value !== '' ? parseInt(value, 10) : null;
                } else if (type.includes('Double') || type.includes('Float') || type.includes('BigDecimal')) {
                    processedParameters[key] = value !== '' ? parseFloat(value) : null;
                } else if (type.includes('Boolean')) {
                    processedParameters[key] = value === true || value === 'true';
                } else {
                    processedParameters[key] = value;
                }
            });
        }

        const payload = {
            tenant: formValue.tenant,
            ruleCode: template.ruleTemplateCode,
            weight: formValue.weight,
            description: formValue.description,
            parameters: processedParameters
        };

        this.dataService.createRule(payload).subscribe({
            next: (response) => {
                this.toastService.success(response || 'Rule created successfully');
                this.router.navigate(['/sys/dashboard']);
            },
            error: (error) => {
                console.error('Failed to create rule', error);
                // ErrorInterceptor will handle the error toast
            }
        });
    }
}
