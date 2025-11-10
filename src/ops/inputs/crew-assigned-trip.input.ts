import { Field, ID, InputType } from '@nestjs/graphql';
import {
  CrewTripUploadDocType,
  TripFilterForCrewType,
} from 'src/app-constants/enums';

@InputType()
export class TripFilterForCrewInput {
  @Field(() => ID)
  crewId: string;

  @Field(() => TripFilterForCrewType, {
    defaultValue: TripFilterForCrewType.upcoming,
  })
  type: TripFilterForCrewType;

  @Field({ nullable: true })
  search?: string;
}

@InputType()
export class TripDocByCrewWhereInput {
  @Field()
  tripId: string;
  @Field()
  sectorNo: number;
}

@InputType()
export class TripDocByCrewDataInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  url: string;

  @Field(() => CrewTripUploadDocType, {
    nullable: true,
  })
  type: CrewTripUploadDocType;

  @Field()
  crew: string;
}
