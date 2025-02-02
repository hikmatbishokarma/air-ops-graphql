import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AircraftCategoriesDto } from 'src/aircraft-categories/dto/aircraft-categories.dto';
import { ClientsDto } from 'src/clients/dto/clients.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('Quote', { description: 'Quotes' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('category', () => AircraftCategoriesDto, { disableRemove: true })
@Relation('requestedBy', () => ClientsDto, { disableRemove: true })
export class QuotesDto extends BaseDTO {
  @FilterableField()
  requestedBy: string;
  @FilterableField()
  representative: string;
  @FilterableField()
  category: string;
  @FilterableField()
  providerType: string;
  // @Field(() => [GraphQLJSONObject])
  // segments: Object[];

  @Field(() => [GraphQLJSONObject])
  itinerary: Object[];
}
