import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('Airport', { description: 'Airport' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class AirportsDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  iata_code: string;
  @FilterableField()
  icao_code: string;
  @Field()
  latitude: number;
  @Field()
  longitude: number;
  @FilterableField()
  city: string;
}
