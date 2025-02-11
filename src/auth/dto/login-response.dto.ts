import { Field, InputType, ObjectType } from '@nestjs/graphql';

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
export class loginResponseDto {
  @Field()
  access_token: string;
  @Field(() => UserInput)
  user: UserInput;
}
