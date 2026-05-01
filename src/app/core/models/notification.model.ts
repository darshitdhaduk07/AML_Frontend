export enum NotificationType {
    CASE_ASSIGNED = 'CASE_ASSIGNED',
    CASE_ESCALATED = 'CASE_ESCALATED',
    SAR_FILED = 'SAR_FILED',
}

export interface InAppNotificationResponseDto {
    id: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}
