import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';
import { QuotesDto, SectorLocationInputDto } from 'src/quotes/dto/quotes.dto';

@ObjectType()
@InputType('mealInput')
export class MealDto {
  @Field({ nullable: true })
  category: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  portions: number;
  @Field({ nullable: true })
  item: string;
  @Field({ nullable: true })
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
  @Field({ nullable: true })
  category: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  seatingCapacity: number;
  @Field({ nullable: true })
  vehicleChoice: string;
  @Field({ nullable: true })
  dropAt: string;
}

@ObjectType()
@InputType('sector')
export class SectorDto {
  @Field({ nullable: true })
  sectorNo: number;
  // @Field()
  // source: string;
  @Field(() => SectorLocationInputDto)
  source: SectorLocationInputDto;
  @Field(() => SectorLocationInputDto)
  destination: SectorLocationInputDto;
  @Field()
  depatureDate: Date;
  @Field()
  depatureTime: string;
  @Field()
  arrivalTime: string;
  @Field()
  arrivalDate: Date;
  @Field()
  pax: number;
  @Field()
  flightTime: string;
  @Field(() => [PassengerDto], { nullable: true })
  passengers: PassengerDto[];
  @Field(() => [MealDto], { nullable: true })
  meals: MealDto[];
  @Field(() => TravelDto, { nullable: true })
  travel: TravelDto;
}

@ObjectType('PassengerDetail', { description: ' Passenger Details' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('quotation', () => QuotesDto, { disableRemove: true })
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class PassengerDetailDto extends BaseDTO {
  @FilterableField()
  quotation: string;
  @FilterableField()
  quotationNo: string;
  @Field(() => [SectorDto], { defaultValue: [] })
  sectors: SectorDto[];

  @FilterableField({ nullable: true })
  operatorId: string;
}
