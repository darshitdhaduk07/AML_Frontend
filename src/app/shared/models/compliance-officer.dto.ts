export interface ComplianceOfficerResponseDto {
    email: string;
    isSuspended: boolean;
    isLocked: boolean;
}

export interface ComplianceInvestigationAssignmentDto {
    customerNumber: string;
    complianceOfficerEmail: string;
}
