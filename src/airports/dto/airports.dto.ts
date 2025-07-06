import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
@InputType('groundHandlersInfo')
export class groundHandlersInfoDTO {
  @Field()
  fullName: string;
  @Field()
  companyName: string;
  @Field()
  contactNumber: string;
  @Field()
  email: string;
}

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
  @FilterableField()
  openHrs: string;
  @FilterableField()
  closeHrs: string;
  @FilterableField()
  contactNumber: string;
  @FilterableField()
  email: string;
  @Field(() => [groundHandlersInfoDTO])
  groundHandlersInfo: groundHandlersInfoDTO;
}
