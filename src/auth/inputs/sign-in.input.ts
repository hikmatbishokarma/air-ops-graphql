import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInInput {
  @Field()
  userName: string;
  @Field()
  password: string;
}
