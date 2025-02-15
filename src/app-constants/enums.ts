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

export enum QuoteStatus {
  NEW_REQUEST = 'new request',
  QUOTED = 'quoted',
  OPPORTUNITY = 'opportunity',
  APPROVAL = 'approval',
  OPTION = 'option',
  BOOKED = 'booked',
  CONTRACT_SENT = 'contract sent',
  INVOICE_SENT = 'invoice sent',
  BRIEFING_SENT = 'briefing sent',
  DONE = 'done',
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
