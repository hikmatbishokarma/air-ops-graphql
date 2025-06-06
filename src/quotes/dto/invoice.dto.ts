import {
  BeforeCreateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { InvoiceType, QuoteStatus } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { QuotesDto } from 'src/quotes/dto/quotes.dto';

@ObjectType('Invoice', { description: 'Invoice' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('quotation', () => QuotesDto, { disableRemove: true })
export class InvoiceDto extends BaseDTO {
  @FilterableField()
  quotation: string;

  @FilterableField()
  quotationNo: string;

  @FilterableField({ defaultValue: false })
  isLatest: boolean;

  @Field(() => Int, { defaultValue: 0 })
  revision: number;

  @FilterableField({ nullable: true })
  proformaInvoiceNo: string;

  @FilterableField({ nullable: true })
  taxInvoiceNo: string;

  @Field()
  template: string;

  @FilterableField(() => InvoiceType)
  type: string;

  @FilterableField({ nullable: true })
  operatorId: string;

  @FilterableField(() => QuoteStatus, {
    defaultValue: QuoteStatus.PROFOMA_INVOICE,
    nullable: true,
  })
  status: QuoteStatus;
}
