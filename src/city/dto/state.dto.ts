import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('State', { description: 'State' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class StateDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  isoCode: string;
  @FilterableField()
  countryCode: string;
  @FilterableField()
  latitude: string;
  @FilterableField()
  longitude: string;
}
