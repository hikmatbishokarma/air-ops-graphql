import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AirportType } from 'src/app-constants/enums';
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
  @Field({ nullable: true })
  alternateContactNumber: string;
  @Field()
  email: string;
}

@ObjectType()
@InputType('fuelSupplier')
export class fuelSupplierDTO {
  @Field()
  companyName: string;
  @Field()
  contactNumber: string;
  @Field({ nullable: true })
  alternateContactNumber: string;
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
  // @Field(() => Float, { nullable: true })
  @FilterableField()
  latitude: string;
  // @Field(() => Float, { nullable: true })
  @FilterableField()
  longitude: string;
  @FilterableField()
  city: string;
  @FilterableField()
  state: string;
  @FilterableField({ nullable: true })
  country: string;
  @FilterableField({ nullable: true })
  openHrs: string;
  @FilterableField({ nullable: true })
  closeHrs: string;
  @FilterableField({ nullable: true })
  contactNumber: string;
  @FilterableField({ nullable: true })
  email: string;
  @Field(() => [groundHandlersInfoDTO])
  groundHandlersInfo: groundHandlersInfoDTO;
  @Field(() => [fuelSupplierDTO])
  fuelSuppliers: fuelSupplierDTO;
  // @FilterableField(() => AirportType, { defaultValue: AirportType.CIVIL })
  // type: AirportType;
  @FilterableField({ nullable: true })
  type: string;

  @Field({ nullable: true })
  elevation: number;
  @Field({ nullable: true })
  approaches: string;
  @Field({ nullable: true })
  longestPrimaryRunway: string;
  @Field({ nullable: true })
  runwaySurface: string;
  @Field({ nullable: true })
  airportLightIntensity: string;
  @Field({ nullable: true })
  airportOfEntry: string;
  @Field({ nullable: true })
  fireCategory: number;
  @Field({ nullable: true })
  slotsRequired: string;
  @Field({ nullable: true })
  handlingMandatory: string;
}
