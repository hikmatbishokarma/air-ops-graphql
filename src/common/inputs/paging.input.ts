import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PagingInput {
  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}
