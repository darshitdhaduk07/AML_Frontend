export interface ParameterMeta {
    type: string;
    required: boolean;
    positive: boolean;
}

export interface RuleTemplateDto {
    ruleTemplateType: string;
    ruleTemplateDescription: string;
    ruleTemplateCode: string;
    requiredParameters: { [key: string]: ParameterMeta };
}
