import { FilterableField, Relation } from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { QuotesDto } from 'src/quotes/dto/quotes.dto';
import { TripSectorDto } from './trip-detail.dto';

@ObjectType()
@InputType('assignedCrewGroupInput')
export class AssignedCrewGroup {
  @Field()
  designation: string;

  @Field(() => [CrewDetailDto])
  crews: CrewDetailDto[];
}

@ObjectType()
@InputType('tripSectorForCrewInput')
export class TripSectorForCrewDto extends TripSectorDto {
  @Field(() => [AssignedCrewGroup])
  crewGroup: AssignedCrewGroup[];
}

@ObjectType()
@InputType('tripAssignedForCrewInput')
export class TripAssignedForCrew {
  @FilterableField()
  tripId: string;

  @FilterableField()
  quotationNo: string;

  @Field(() => QuotesDto, { nullable: true })
  quotation: QuotesDto; // <-- now correct hydrated object

  @Field(() => TripSectorForCrewDto)
  sector: TripSectorForCrewDto;

  @Field()
  departureDateTime: Date;

  @Field()
  arrivalDateTime: Date;
}

@ObjectType()
export class TripAssignedForCrewResult {
  @Field(() => [TripAssignedForCrew])
  result: TripAssignedForCrew[];
  @Field()
  totalCount: number;
}
