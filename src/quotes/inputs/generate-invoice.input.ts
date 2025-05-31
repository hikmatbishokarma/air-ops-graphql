import { Field, InputType } from '@nestjs/graphql';
import { InvoiceType } from 'src/app-constants/enums';

@InputType()
export class GenerateInvoiceInput {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  quotationNo?: string;
  @Field({ nullable: true })
  proformaInvoiceNo?: string;
  @Field(() => InvoiceType, { defaultValue: InvoiceType.PROFORMA_INVOICE })
  type: InvoiceType;
  @Field({ nullable: true })
  operatorId?: string;
}
