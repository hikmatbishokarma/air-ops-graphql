import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { OperatorDto } from 'src/operator/dto/operator.dto';
import { AircraftCategoriesDto } from 'src/aircraft-categories/dto/aircraft-categories.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
export class specificationsDTO {
  @Field()
  title: string;
  @Field()
  value: string;
}

@ObjectType('AircraftDetail', { description: 'Aircraft Detail' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
// @Relation('category', () => AircraftCategoriesDto, { disableRemove: true })
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class AircraftDetailDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  code: string;
  // @FilterableField()
  // category: string;
  // @Field()
  // description: string;
  @Field(() => [GraphQLJSONObject], { nullable: true })
  specifications: specificationsDTO[];
  @Field({ description: 'Flights/Helicoptor Terms and Conditions' })
  termsAndConditions: string;
  @Field({ nullable: true })
  noteText: string;
  // @Field({ nullable: true })
  // warningText: string;
  @Field({ nullable: true })
  warningImage: string;
  @Field(() => [String], { nullable: true })
  flightImages: string[];
  @Field({ nullable: true })
  seatLayoutImage: string;
  @Field({ nullable: true })
  rangeMapImage: string;
  @FilterableField({ nullable: true })
  operatorId: string;
  @Field(() => [String], { nullable: true })
  flightInteriorImages: string[];
}
