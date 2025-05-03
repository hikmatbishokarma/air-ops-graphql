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
import { Gender, RoleType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { RoleDTO } from 'src/roles/dto/roles.dto';
import { CreateUserHook } from '../hooks/create-user.hook';
import { Exclude } from 'class-transformer';
import { AgentDto } from 'src/agent/dto/agent.dto';

@ObjectType('User', { description: 'user dto' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('role', () => RoleDTO, { disableRemove: true })
@Relation('agent', () => AgentDto, { disableRemove: true })
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

  @FilterableField()
  role: string;

  @FilterableField({ nullable: true })
  agentId: string;
}
