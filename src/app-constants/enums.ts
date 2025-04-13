import { registerEnumType } from '@nestjs/graphql';

//#region  ROLES ENUMS

export enum RoleType {
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  SALES = 'SALES',
  OPERATOR = 'OPERATOR',
  SITE_ADMIN = 'SITE ADMIN',
  USER = 'USER',
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
  INVOICE='invoice'
}

export enum CounterType {
  quotation = 'quotation',
  proformaInvoice = 'progormaInvoice',
  taxInvoice='taxIncoice'
}

export enum SalesDocumentType {
   QUOTATION = 'quotation',
  INVOICE='invoice'
}

registerEnumType(SalesDocumentType, {
  name: 'SalesDocumentType',
});

export enum InvoiceType{

   PROFORMA_INVOICE = 'progormaInvoice',
  TAX_INVOICE='taxIncoice'
}


registerEnumType(InvoiceType, {
  name: 'InvoiceType',
});
