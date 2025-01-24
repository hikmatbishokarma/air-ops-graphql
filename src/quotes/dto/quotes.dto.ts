import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('Quote', { description: 'Quotes' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class QuotesDto extends BaseDTO {
  @FilterableField()
  requestedBy: string;
  @FilterableField()
  representative: string;
  @FilterableField()
  category: string;

  @Field(() => [GraphQLJSONObject])
  segments: Object[];
}
