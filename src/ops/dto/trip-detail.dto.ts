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
import { QuotesDto, SectorLocationInputDto } from 'src/quotes/dto/quotes.dto';
import { CreateTripDetailHook } from '../hooks/create-trip-detail.hook';
import {
  CrewTripUploadDocType,
  TripDetailStatus,
  TripSectorStatus,
} from 'src/app-constants/enums';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';

@ObjectType()
@InputType('tripDocByCrewInput')
export class TripDocByCrewDto {
  @Field({ nullable: true })
  name: string;

  @Field()
  url: string;

  @Field(() => CrewTripUploadDocType, {
    nullable: true,
  })
  type: CrewTripUploadDocType;

  @Field()
  crew: string; // store ObjectId here from DB

  @Field(() => CrewDetailDto, { name: 'crewDetails' })
  crewDetails?: CrewDetailDto;
}

@ObjectType()
@InputType('assignedCrewInput')
export class AssignedCrewDto {
  @Field()
  designation: string;
  @Field(() => [String], { nullable: true })
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
  fuelReceipt: string;

  @Field({ nullable: true })
  handledBy: string;

  @Field({ nullable: true })
  designation: string;
}

@ObjectType()
@InputType('BaReport')
export class BaReportDto {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  reading: string;
  @Field({ nullable: true })
  conductedDate: Date;
  @Field({ nullable: true })
  record: string;
  @Field({ nullable: true })
  video: string;
}

@ObjectType()
@InputType('BaPerson')
export class BaPersonDto {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  gender: string;
  @Field({ nullable: true })
  age: string;
  @Field({ nullable: true })
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
  // @Field()
  // source: string;
  // @Field()
  // destination: string;

  @Field(() => SectorLocationInputDto, { nullable: true })
  source: SectorLocationInputDto;
  @Field(() => SectorLocationInputDto, { nullable: true })
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

  @Field(() => [TripDocByCrewDto], { nullable: true })
  tripDocByCrew: TripDocByCrewDto[];
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
