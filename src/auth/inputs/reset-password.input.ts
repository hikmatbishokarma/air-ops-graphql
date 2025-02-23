import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  userId: string;
  @Field()
  currentPwd: string;
  @Field()
  newPwd: string;
  @Field()
  confirmPwd: string;
}
