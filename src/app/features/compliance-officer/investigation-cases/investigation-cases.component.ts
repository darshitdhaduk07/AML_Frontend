import { Component } from '@angular/core';
import { CaseListComponent } from '../../../shared/components/case-list/case-list.component';

@Component({
    selector: 'app-co-investigation-cases',
    standalone: true,
    imports: [CaseListComponent],
    template: `<app-case-list role="OFFICER"></app-case-list>`
})
export class CoInvestigationCasesComponent {}
