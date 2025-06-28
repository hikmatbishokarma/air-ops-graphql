import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SaleConfirmationInput {
  @Field()
  quotationNo: string;
}
