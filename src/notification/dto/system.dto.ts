export class CreateSystemNotificationDto {
  type: 'ACCESS_REQUEST' | 'QUOTE_CREATED' | string;
  refType: 'ACCESS_REQUEST' | 'QUOTE' | 'MANUAL' | string;
  refId: string;
  message: string;
  title?: string;
  recipientRoles?: string[];
  recipientIds?: string[];
  metadata?: Record<string, any>;
}
