import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('Country', { description: 'Country' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class CountryDto extends BaseDTO {
  @FilterableField()
  name: string;

  @FilterableField()
  isoCode: string;

  @FilterableField()
  dialCode: string;

  @FilterableField()
  emoji?: string;

  @FilterableField()
  flagUrl?: string;

  @FilterableField()
  currency?: string;

  @FilterableField()
  latitude?: string;

  @FilterableField()
  longitude?: string;

  @FilterableField()
  timezone?: string;
}
