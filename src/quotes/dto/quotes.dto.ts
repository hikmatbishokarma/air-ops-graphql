import {
  BeforeCreateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AircraftCategoriesDto } from 'src/aircraft-categories/dto/aircraft-categories.dto';
import { AircraftsDto } from 'src/aircrafts/dto/aircrafts.dto';
import { QuoteStatus } from 'src/app-constants/enums';
import { ClientsDto } from 'src/clients/dto/clients.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { CreateQuoteHook } from '../hooks/create-quote.hook';

@ObjectType('Quote', { description: 'Quotes' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('category', () => AircraftCategoriesDto, { disableRemove: true })
@Relation('aircraft', () => AircraftsDto, { disableRemove: true })
@Relation('requestedBy', () => ClientsDto, { disableRemove: true })
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
  referenceNumber: string;
  // @Field(() => [GraphQLJSONObject])
  // segments: Object[];

  @Field(() => [GraphQLJSONObject])
  itinerary: Object[];
  @FilterableField(() => QuoteStatus, { defaultValue: QuoteStatus.NEW_REQUEST })
  status: QuoteStatus;
}
