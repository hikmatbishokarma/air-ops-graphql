import {
  BeforeCreateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
  UnPagedRelation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Gender, RoleType, UserType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { RoleDTO } from 'src/roles/dto/roles.dto';
import { CreateUserHook } from '../hooks/create-user.hook';
import { Exclude } from 'class-transformer';
import { OperatorDto } from 'src/operator/dto/operator.dto';

@ObjectType('User', { description: 'user dto' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@UnPagedRelation('roles', () => RoleDTO, { disableRemove: true })
@Relation('operator', () => OperatorDto, { disableRemove: true })
@BeforeCreateOne(CreateUserHook)
@InputType()
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
  address: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  pinCode: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  dob: string;

  @Field(() => Gender, { nullable: true })
  gender: Gender;

  // @FilterableField()
  // role: string;

  @FilterableField(() => [String], {
    allowedComparisons: ['eq', 'neq', 'in', 'notIn'],
    nullable: true,
  })
  roles: string[];

  @FilterableField({ nullable: true })
  operatorId: string;

  @FilterableField(() => UserType, { defaultValue: UserType.PLATFORM_USER })
  type: UserType;

  @Field(() => UserDTO, { nullable: true })
  createdByUser?: UserDTO; // ✅ Add this for relation
}
