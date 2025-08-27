import {
  BeforeCreateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';
import { QuotesDto } from 'src/quotes/dto/quotes.dto';
import { CreateTripDetailHook } from '../hooks/create-trip-detail.hook';
import { TripDetailStatus, TripSectorStatus } from 'src/app-constants/enums';

@ObjectType()
@InputType('assignedCrewInput')
export class AssignedCrewDto {
  @Field()
  designation: string;
  @Field(() => [String])
  crews: string[];
}

@ObjectType()
@InputType('DocumentInput')
export class DocumentDto {
  @Field()
  type: string;

  @Field()
  externalLink: string;

  @Field()
  fileUrl: string;
}

@ObjectType()
@InputType('FuelRecordInput')
export class FuelRecordDto {
  @Field()
  fuelStation: string;

  @Field()
  uploadedDate: Date;

  @Field()
  fuelOnArrival: string;

  @Field()
  fuelLoaded: string;

  @Field()
  fuelGauge: string;

  @Field()
  handledBy: string;

  @Field()
  designation: string;
}

@ObjectType()
@InputType('TripSector')
export class TripSectorDto {
  @Field({ nullable: true })
  sectorNo: number;
  @Field()
  source: string;
  @Field()
  destination: string;
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
  @Field(() => [DocumentDto])
  documents: DocumentDto[];
  @Field(() => [AssignedCrewDto])
  assignedCrews: AssignedCrewDto[];
  @Field(() => FuelRecordDto)
  fuelRecord: FuelRecordDto;
  @FilterableField(() => TripSectorStatus, {
    defaultValue: TripSectorStatus.IN_PROGRESS,
  })
  status: TripSectorStatus;
}

@ObjectType('TripDetail', { description: 'Trip Detail ' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('quotation', () => QuotesDto, { disableRemove: true })
@Relation('operator', () => OperatorDto, { disableRemove: true })
@BeforeCreateOne(CreateTripDetailHook)
export class TripDetailDto extends BaseDTO {
  @FilterableField()
  tripId: string;
  @FilterableField()
  quotation: string;
  @FilterableField()
  quotationNo: string;
  @Field(() => [TripSectorDto], { defaultValue: [] })
  sectors: TripSectorDto[];
  @FilterableField({ nullable: true })
  operatorId: string;
  @FilterableField(() => TripDetailStatus, {
    defaultValue: TripDetailStatus.DRAFT,
  })
  status: TripDetailStatus;
}
