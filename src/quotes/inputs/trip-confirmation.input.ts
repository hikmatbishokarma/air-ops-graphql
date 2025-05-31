import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TripConfirmationInput {
  @Field()
  quotationNo: string;
}
