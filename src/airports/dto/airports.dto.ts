import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, Float, ObjectType } from '@nestjs/graphql';
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
  @Field(() => Float)
  latitude: number;
  @Field(() => Float)
  longitude: number;
  @FilterableField()
  city: string;
  @FilterableField({ nullable: true })
  country: string;
}
