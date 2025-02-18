import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@InputType('userInput')
export class UserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  roleType: string;
}

@ObjectType()
@InputType('roleInput')
export class RoleInput {
  @Field()
  name: string;
  @Field()
  roleType: string;
  @Field(() => [GraphQLJSONObject])
  accessPermission: object[];
}

@ObjectType()
export class loginResponseDto {
  @Field()
  access_token: string;
  @Field(() => UserInput)
  user: UserInput;
  // @Field(() => RoleInput)
  // role: RoleInput;
}
