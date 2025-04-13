import { Field, InputType } from '@nestjs/graphql';
import {  SalesDocumentType } from 'src/app-constants/enums';

@InputType()
export class acknowledgementInput {
  @Field()
  quotationNo: string;
  @Field()
  email: string;
  @Field(() => SalesDocumentType)
  documentType: SalesDocumentType;
}
