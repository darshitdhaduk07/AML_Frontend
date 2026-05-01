import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleTemplateDto } from '../../../../../../shared/models/rule-template.dto';

@Component({
    selector: 'app-rule-template-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rule-template-card.component.html',
    styleUrl: './rule-template-card.component.css'
})
export class RuleTemplateCardComponent {
    @Input() template!: RuleTemplateDto;
    @Input() isSelected: boolean = false;
    @Output() selected = new EventEmitter<RuleTemplateDto>();

    onSelect() {
        this.selected.emit(this.template);
    }
}
