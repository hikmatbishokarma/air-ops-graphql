import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { QuotesDto } from 'src/quotes/dto/quotes.dto';

@ObjectType()
@InputType('mealInput')
export class MealDto {
  @Field()
  category: string;
  @Field()
  type: string;
  @Field()
  portions: number;
  @Field()
  item: string;
  @Field()
  instructions: string;
}

@ObjectType()
@InputType('passengerInput')
export class PassengerDto {
  @Field()
  name: string;
  @Field()
  gender: string;
  @Field()
  age: number;
  @Field()
  aadharId: string;
}

@ObjectType()
@InputType('travelInput')
export class TravelDto {
  @Field()
  category: string;
  @Field()
  type: string;
  @Field()
  seatingCapacity: number;
  @Field()
  vehicleChoice: string;
  @Field()
  dropAt: string;
}

@ObjectType('PassengerDetail', { description: ' Passenger Details' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('quotation', () => QuotesDto, { disableRemove: true })
export class PassengerDetailDto extends BaseDTO {
  @FilterableField()
  quotation: string;
  @FilterableField()
  quotationNo: string;
  @Field(() => [PassengerDto])
  passengers: PassengerDto[];
  @Field(() => [MealDto])
  meals: MealDto[];
  @Field(() => [TravelDto])
  travel: TravelDto;
  @Field(() => GraphQLJSONObject)
  meta: object;
}
