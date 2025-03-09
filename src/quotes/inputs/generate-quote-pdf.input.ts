import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GenerateQuotePdfInput {
  @Field()
  id: string;
  @Field()
  email: string;
}
