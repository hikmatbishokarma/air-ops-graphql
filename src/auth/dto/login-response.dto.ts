import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AgentDto } from 'src/agent/dto/agent.dto';
import { UserDTO } from 'src/users/dto/users.dto';

@ObjectType()
@InputType('roleInput')
export class RoleInput {
  @Field()
  name: string;
  @Field()
  type: string;
  @Field(() => [GraphQLJSONObject])
  accessPermissions: object[];
}

@ObjectType()
@InputType('userInput')
export class UserInput extends UserDTO {
  @Field()
  id: string;
  // @Field()
  // name: string;
  // @Field()
  // email: string;
  // @Field({ nullable: true })
  // image: string;
  // @Field(() => RoleInput, { nullable: true })
  // role: RoleInput;
  @Field(() => [String])
  roles: string[];
  @Field(() => [GraphQLJSONObject])
  permissions: Object[];
  @Field(() => AgentDto, { nullable: true })
  agent: AgentDto;
}

@ObjectType()
export class loginResponseDto {
  @Field()
  access_token: string;
  @Field(() => UserInput)
  user: UserInput;
}
