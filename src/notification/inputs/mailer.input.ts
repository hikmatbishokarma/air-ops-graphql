import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MailerInput {
  @Field()
  to: string;
  @Field()
  subject: string;
  @Field()
  text: string;
  @Field({ nullable: true })
  html?: string;
}
