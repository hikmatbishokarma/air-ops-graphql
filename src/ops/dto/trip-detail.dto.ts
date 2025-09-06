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

  @Field({ nullable: true })
  externalLink: string;

  @Field({ nullable: true })
  fileUrl: string;
}

@ObjectType()
@InputType('FuelRecordInput')
export class FuelRecordDto {
  @Field({ nullable: true })
  fuelStation: string;

  @Field({ nullable: true })
  uploadedDate: Date;

  @Field({ nullable: true })
  fuelOnArrival: string;

  @Field({ nullable: true })
  fuelLoaded: string;

  @Field({ nullable: true })
  fuelGauge: string;

  @Field({ nullable: true })
  handledBy: string;

  @Field({ nullable: true })
  designation: string;
}

@ObjectType()
@InputType('BaReport')
export class BaReportDto {
  @Field()
  name: string;
  @Field()
  reading: string;
  @Field()
  conductedDate: Date;
  @Field()
  record: string;
  @Field({ nullable: true })
  video: string;
}

@ObjectType()
@InputType('BaPerson')
export class BaPersonDto {
  @Field()
  name: string;
  @Field()
  gender: string;
  @Field()
  age: string;
  @Field()
  certNo: string;
}

@ObjectType()
@InputType('BaInfo')
export class BaInfoDto {
  @Field({ nullable: true })
  baMachine: string;
  @Field(() => [BaPersonDto], { nullable: true })
  baPersons: BaPersonDto[];
  @Field(() => [BaReportDto], { nullable: true })
  baReports: BaReportDto[];
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
  @Field(() => [DocumentDto], { nullable: true })
  documents: DocumentDto[];
  @Field(() => [AssignedCrewDto], { nullable: true })
  assignedCrews: AssignedCrewDto[];
  @Field(() => FuelRecordDto, { nullable: true })
  fuelRecord: FuelRecordDto;

  @Field(() => BaInfoDto, { nullable: true })
  baInfo: BaInfoDto;
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
