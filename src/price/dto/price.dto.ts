import { FilterableField, Relation } from '@app/query-graphql';
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AircraftsDto } from 'src/aircrafts/dto/aircrafts.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
@InputType('priceInput')
export class PriceInputDto {
  @Field(() => String, { defaultValue: 'Block Hour Fee' })
  label: string;
  @Field(() => Float, { defaultValue: 0 })
  unit: string;
  @Field(() => Float, { defaultValue: 0 })
  price: number;
  @Field(() => String, { defaultValue: 'INR' })
  currency: string;
  @Field(() => Float, { defaultValue: 0 })
  total: number;
  @Field(() => Float, { defaultValue: 0 })
  margin: number;
  @Field(() => Float, { defaultValue: 0 })
  grandTotal: number;
}

@ObjectType('price', { description: 'price' })
@Relation('aircraft', () => AircraftsDto, { disableRemove: true })
export class PriceDto extends BaseDTO {
  @FilterableField()
  aircraft: string;
  @Field(() => [PriceInputDto])
  prices: PriceInputDto[];
}
