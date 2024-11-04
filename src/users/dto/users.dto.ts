import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';

export class UserDTO1 {
  id: number;
  name: string;
  password: string;
}

export class AddressDTO {
  @Field()
  street: string;
  @Field()
  city: string;
  @Field()
  state: string;
  @Field()
  country: string;
  @Field()
  zipCode: string;
}

@ObjectType('User', { description: 'user dto' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
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
  mobile: string;

  @Field(() => [GraphQLJSONObject])
  address: AddressDTO[]; // Using the Address interface here
}
