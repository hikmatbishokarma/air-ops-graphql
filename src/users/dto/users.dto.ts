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
import { RoleType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { RoleDTO } from 'src/roles/dto/roles.dto';
import { CreateUserHook } from '../hooks/create-user.hook';
import { Exclude } from 'class-transformer';

export class UserDTO1 {
  id: number;
  name: string;
  password: string;
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

  @Exclude()
  @Field()
  password: string;

  @IsEmail()
  @FilterableField()
  email: string;

  @IsMobilePhone()
  @FilterableField({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  addresses: string;

  @Field({ nullable: true })
  image: string;

  // @FilterableField(() => RoleType)
  // roleType: RoleType;

  @FilterableField()
  role: string;
}
