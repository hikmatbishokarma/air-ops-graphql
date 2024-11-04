import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  User = 'user',
  Admin = 'admin',
}
