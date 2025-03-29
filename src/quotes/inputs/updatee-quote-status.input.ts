import { FilterableField } from '@app/query-graphql';
import { Field, InputType } from '@nestjs/graphql';
import { QuoteStatus } from 'src/app-constants/enums';

@InputType()
export class UpdateQuoteStatusInput {
  @Field()
  id: string;
  @FilterableField(() => QuoteStatus, { defaultValue: QuoteStatus.QUOTE })
  status: QuoteStatus;
}
