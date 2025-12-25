import { Field, InputType } from '@nestjs/graphql';
import { SalesDocumentType } from 'src/app-constants/enums';

@InputType()
export class acknowledgementInput {
  @Field()
  quotationNo: string;
  @Field()
  email: string;
  @Field(() => SalesDocumentType)
  documentType: SalesDocumentType;

  @Field({ nullable: true })
  tripId?: string;

  @Field({ nullable: true })
  sectorNo?: number;
}
