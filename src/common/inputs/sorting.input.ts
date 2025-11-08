import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SortInput {
  @Field({ nullable: true })
  createdAt?: 'asc' | 'desc';

  @Field({ nullable: true })
  updatedAt?: 'asc' | 'desc';
}
