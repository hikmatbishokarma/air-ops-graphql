import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetPasswordDto {
  @Field()
  status: boolean;
  @Field()
  message: string;
}
