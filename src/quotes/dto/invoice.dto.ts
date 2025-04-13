import {
  BeforeCreateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { InvoiceType } from 'src/app-constants/enums';
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

  @FilterableField()
  invoiceNo: string;

  @Field()
  template: string

  @FilterableField(() => InvoiceType)
  type: string

}
