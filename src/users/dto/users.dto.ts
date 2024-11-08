import {
  BeforeCreateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AddressTag, RoleType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { RoleDTO } from 'src/roles/dto/roles.dto';
import { CreateUserHook } from '../hooks/create-user.hook';

export class UserDTO1 {
  id: number;
  name: string;
  password: string;
}

@ObjectType()
export class AddressesDTO {
  @Field()
  address: string;
  @Field({ description: 'House/Falt No' })
  house: string;
  @Field()
  landMark: string;
  @Field(() => AddressTag)
  tag: AddressTag;
}

@ObjectType('User', { description: 'user dto' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('role', () => RoleDTO, { disableRemove: true })
@BeforeCreateOne(CreateUserHook)
export class UserDTO extends BaseDTO {
  @FilterableField()
  name: string;

  @Field()
  password: string;

  @IsEmail()
  @FilterableField()
  email: string;

  @IsMobilePhone()
  @FilterableField()
  phone: string;

  @Field(() => [GraphQLJSONObject])
  address: AddressesDTO[];

  @FilterableField(() => RoleType)
  roleType: RoleType;

  @FilterableField()
  role: string;
}
