import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MailerResponseDto {
  @Field()
  success: boolean;
  @Field()
  message: string;
}
