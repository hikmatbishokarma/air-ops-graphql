import {
  BeforeCreateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AircraftCategoriesDto } from 'src/aircraft-categories/dto/aircraft-categories.dto';
import { Category, QuoteStatus } from 'src/app-constants/enums';
import { ClientsDto } from 'src/clients/dto/clients.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { CreateQuoteHook } from '../hooks/create-quote.hook';
import { PriceInputDto } from 'src/price/dto/price.dto';
import { AircraftDetailDto } from 'src/aircraft-detail/dto/aircraft-detail.dto';
import { RepresentativeDto } from 'src/representative/dto/representative.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';

@ObjectType('Quote', { description: 'Quotes' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
// @Relation('category', () => AircraftCategoriesDto, { disableRemove: true })
@Relation('aircraft', () => AircraftDetailDto, {
  disableRemove: true,
  nullable: true,
})
@Relation('requestedBy', () => ClientsDto, { disableRemove: true })
@Relation('representative', () => RepresentativeDto, {
  disableRemove: true,
  nullable: true,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
@BeforeCreateOne(CreateQuoteHook)
export class QuotesDto extends BaseDTO {
  @Field(() => ID)
  id!: string;
  @FilterableField()
  requestedBy: string;
  @FilterableField({ nullable: true })
  representative: string;
  @FilterableField(() => Category)
  category: Category;
  @FilterableField()
  aircraft: string;
  @FilterableField()
  providerType: string;
  @FilterableField()
  quotationNo: string;
  // @FilterableField({ nullable: true })
  // revisedQuotationNo: string;
  @Field(() => [GraphQLJSONObject])
  itinerary: Object[];
  @FilterableField(() => QuoteStatus, { defaultValue: QuoteStatus.QUOTE })
  status: QuoteStatus;
  @Field(() => [PriceInputDto])
  prices: PriceInputDto[];
  @Field(() => Float, { defaultValue: 0 })
  grandTotal: number;

  @Field(() => Int, { defaultValue: 1 })
  version: number;
  @FilterableField({ defaultValue: true })
  isLatest: boolean;
  @FilterableField()
  code: string;
  @Field(() => Int, { defaultValue: 0 })
  revision: number;

  // @FilterableField({ nullable: true })
  // proformaInvoiceNo: string;

  // @Field(() => Int, { defaultValue: 0, nullable: true })
  // proformaInvoiceRevision: number;

  @FilterableField({ nullable: true })
  operatorId: string;
  @Field({ nullable: true })
  confirmationTemplate?: string;
}

@ObjectType()
export class CalenderData {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field()
  start: Date;
  @Field()
  end: Date;
  @Field()
  depatureTime: string;
  @Field()
  arrivalTime: string;
  @Field(() => GraphQLJSONObject)
  aircraft: Object;
  @Field()
  source: string;
  @Field()
  destination: string;
  @Field()
  duration: string;
}

@ObjectType()
export class CalenderDataResponse {
  @Field(() => [CalenderData])
  calenderData: CalenderData[];
}
