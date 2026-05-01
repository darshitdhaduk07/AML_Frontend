import { Component, Input, Output, EventEmitter, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleTemplateDto } from '../../../../../../shared/models/rule-template.dto';
import { RuleTemplateCardComponent } from '../rule-template-card/rule-template-card.component';

@Component({
    selector: 'app-rule-template-dropdown',
    standalone: true,
    imports: [CommonModule, RuleTemplateCardComponent],
    templateUrl: './rule-template-dropdown.component.html',
    styleUrl: './rule-template-dropdown.component.css'
})
export class RuleTemplateDropdownComponent {
    @Input() templates: RuleTemplateDto[] = [];
    @Input() selectedTemplate: RuleTemplateDto | null = null;
    @Output() selectionChange = new EventEmitter<RuleTemplateDto>();

    isOpen = false;
    private elementRef = inject(ElementRef);

    toggleDropdown() {
        this.isOpen = !this.isOpen;
    }

    selectTemplate(template: RuleTemplateDto) {
        this.selectionChange.emit(template);
        this.isOpen = false;
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }
}
