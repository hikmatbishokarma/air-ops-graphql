import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordDto {
  @Field()
  status: boolean;
  @Field()
  message: string;
}
