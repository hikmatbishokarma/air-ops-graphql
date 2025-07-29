import { registerEnumType } from '@nestjs/graphql';

//#region  ROLES ENUMS

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  OPS = 'OPS',
  ENGINEERING = 'ENGINEERING',
  AUDIT = 'AUDIT',
  ACCOUNTING = 'ACCOUNTING',
}

registerEnumType(RoleType, {
  name: 'RoleType',
});

//#endregion

//#region  RESOURCE ACTION ENUM

export enum ResourceAction {
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delet',
}
registerEnumType(ResourceAction, {
  name: 'ResourceAction',
});

//#endregion

export enum ClientType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
registerEnumType(ClientType, {
  name: 'ClientType',
});

// export enum QuoteStatus {
//   NEW_REQUEST = 'new request',
//   QUOTED = 'quoted',
//   OPPORTUNITY = 'opportunity',
//   APPROVAL = 'approval',
//   OPTION = 'option',
//   BOOKED = 'booked',
//   CONTRACT_SENT = 'contract sent',
//   INVOICE_SENT = 'invoice sent',
//   BRIEFING_SENT = 'briefing sent',
//   DONE = 'done',
//   UPGRADED = 'upgraded',
//   CANCELLED = 'cancelled',
//   CONFIRMED = 'confirmed',
// }

export enum QuoteStatus {
  QUOTE = 'Quote',
  PROFOMA_INVOICE = 'Proforma Invoice',
  TAX_INVOICE = 'Tax Invoice',
  CANCELLED = 'Cancelled',
  'DEPRECATED' = 'Deprecated',
  SALE_CONFIRMED = 'Sale Confirmed',
}

registerEnumType(QuoteStatus, {
  name: 'QuoteStatus',
});

export enum Permissions {
  READ = 'READ',
  WRITE = 'WRITE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

registerEnumType(Permissions, {
  name: 'Permissions',
});

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

registerEnumType(Gender, {
  name: 'Gender',
});

export enum DateRange {
  today = 'today',
  yesterday = 'yesterday',
  lastWeek = '7d',
  lastMonth = '30d',
  custom = 'custom',
}
registerEnumType(DateRange, {
  name: 'DateRange',
});

export enum TemplateType {
  QUOTATION = 'quotation',
  INVOICE = 'invoice',
}

export enum CounterType {
  quotation = 'quotation',
  proformaInvoice = 'progormaInvoice',
  taxInvoice = 'taxIncoice',
}

export enum SalesDocumentType {
  QUOTATION = 'quotation',
  PROFORMA_INVOICE = 'Proforma Invoice',
  TAX_INVOICE = 'Tax Invoice',
  SALE_CONFIRMATION = 'Sale Confirmation',
}

registerEnumType(SalesDocumentType, {
  name: 'SalesDocumentType',
});

export enum InvoiceType {
  PROFORMA_INVOICE = 'Proforma Invoice',
  TAX_INVOICE = 'Tax Invoice',
}

registerEnumType(InvoiceType, {
  name: 'InvoiceType',
});

export enum SubscriptionPlan {
  FREE = 'free',
  STANDARD = 'standard',
  ENTERPRISE = 'enterprise',
}

registerEnumType(SubscriptionPlan, {
  name: 'SubscriptionPlan',
});

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

registerEnumType(BillingCycle, {
  name: 'BillingCycle',
});

export enum UserType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PLATFORM_USER = 'PLATFORM_USER',
  AGENT_ADMIN = 'AGENT_ADMIN',
  AGENT_USER = 'AGENT_USER',
}

registerEnumType(UserType, {
  name: 'type',
});

export enum Category {
  CHARTER = 'Charter',
  IN_HOUSE = 'In House',
  TEST_FLIGHT = 'Test Flight',
  TRAINING = 'Training',
  GROUND_RUN = 'Ground Run',
}

registerEnumType(Category, {
  name: 'Category',
});

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  PARTIAL = 'Partial',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

export enum CrewType {
  DOCTOR = 'DOCTOR',
  ENGINEER = 'ENGINEER',
  PILOT = 'PILOT',
  CABIN_CREW = 'CABIN_CREW',
}

registerEnumType(CrewType, {
  name: 'CrewType',
});

export enum LeaveType {
  CASUAL_LEAVE = 'Casual Leave',
  SICK_LEAVE = 'Sick Leave',
  PRIVILEGE_LEAVE = 'Privilege Leave',
  PATERNITY_LEAVE = 'Paternity Leave',
  MARRIAGE_LEAVE = 'Marriage Leave',
  BEREAVEMENT_LEAVE = 'Bereavement Leave',
}

registerEnumType(LeaveType, {
  name: 'LeaveType',
});

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DECLINED = 'Declined',
  CANCELLED = 'Cancelled',
}

registerEnumType(LeaveStatus, {
  name: 'LeaveStatus',
});

export enum AccessRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

registerEnumType(AccessRequestStatus, {
  name: 'AccessRequestStatus',
});

export enum AirportType {
  CIVIL = 'Civil Airport',
  HELIPORT = 'Heliport',
  AIR_STRIP = 'Air Strip',
  DEFENCE = 'Defence Airport',
}

registerEnumType(AirportType, {
  name: 'AirportType',
});
