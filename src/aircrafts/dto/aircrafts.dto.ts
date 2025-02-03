import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AircraftCategoriesDto } from 'src/aircraft-categories/dto/aircraft-categories.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
export class specificationsDTO {
  @Field()
  icon: string;
  @Field()
  name: string;
}

@ObjectType('Aircraft', { description: 'Aircraft' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('category', () => AircraftCategoriesDto, { disableRemove: true })
export class AircraftsDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  category: string;
  @Field()
  description: string;
  @Field()
  image: string;
  @Field(() => [GraphQLJSONObject])
  specifications: specificationsDTO[];
  @Field({ description: 'Flights/Helicoptor Terms and Conditions' })
  termsAndConditions: string;
}
