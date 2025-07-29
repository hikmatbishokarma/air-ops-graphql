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
  @Field(() => Float, { nullable: true })
  latitude: number;
  @Field(() => Float, { nullable: true })
  longitude: number;
  @FilterableField()
  city: string;
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
  @FilterableField(() => AirportType, { defaultValue: AirportType.CIVIL })
  type: AirportType;
}
