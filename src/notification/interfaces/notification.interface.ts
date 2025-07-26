export interface ISystemNotification {
  type: string;
  refType: string;
  refId: string;
  message: string;
  title?: string;
  recipientRoles?: string[];
  recipientIds?: string[];
  metadata?: Record<string, any>;
}
