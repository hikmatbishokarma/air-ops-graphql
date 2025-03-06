import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AircraftDetailDto } from 'src/aircraft-detail/dto/aircraft-detail.dto';

import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
@InputType('priceInput')
export class PriceInputDto {
  @Field(() => String, { defaultValue: 'Block Hour Fee' })
  label: string;
  @Field(() => String, { defaultValue: '01:10', description: 'duration' })
  unit: string;
  @Field(() => Float, { defaultValue: 0 })
  price: number;
  @Field(() => String, { defaultValue: 'INR' })
  currency: string;
  @Field(() => Float, { defaultValue: 0 })
  total: number;
  @Field(() => Float, { defaultValue: 0 })
  margin: number;
}

@ObjectType('price', { description: 'price' })
@Relation('aircraft', () => AircraftDetailDto, { disableRemove: true })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class PriceDto extends BaseDTO {
  @FilterableField()
  aircraft: string;
  @Field(() => [PriceInputDto])
  prices: PriceInputDto[];
  @Field(() => Float, { defaultValue: 0 })
  grandTotal: number;
}
