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
import { QuoteStatus } from 'src/app-constants/enums';
import { ClientsDto } from 'src/clients/dto/clients.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { CreateQuoteHook } from '../hooks/create-quote.hook';
import { PriceInputDto } from 'src/price/dto/price.dto';
import { AircraftDetailDto } from 'src/aircraft-detail/dto/aircraft-detail.dto';
import { RepresentativeDto } from 'src/representative/dto/representative.dto';
import { AgentDto } from 'src/agent/dto/agent.dto';

@ObjectType('Quote', { description: 'Quotes' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('category', () => AircraftCategoriesDto, { disableRemove: true })
@Relation('aircraft', () => AircraftDetailDto, {
  disableRemove: true,
  nullable: true,
})
@Relation('requestedBy', () => ClientsDto, { disableRemove: true })
@Relation('representative', () => RepresentativeDto, { disableRemove: true })
@Relation('agent', () => AgentDto, { disableRemove: true })
@BeforeCreateOne(CreateQuoteHook)
export class QuotesDto extends BaseDTO {
  @Field(() => ID)
  id!: string;
  @FilterableField()
  requestedBy: string;
  @FilterableField()
  representative: string;
  @FilterableField()
  category: string;
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
  @FilterableField({ nullable: true })
  proformaInvoiceNo: string;

  @Field(() => Int, { defaultValue: 0, nullable: true })
  proformaInvoiceRevision: number;

  @FilterableField({ nullable: true })
  agentId: string;
}
