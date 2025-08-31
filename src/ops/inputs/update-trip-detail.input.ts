import { Field, ID, InputType } from '@nestjs/graphql';
import { TripSectorDto } from '../dto/trip-detail.dto';

@InputType()
export class UpdateTripDetailWhereInput {
  @Field(() => ID)
  _id: string;
}

@InputType()
export class UpdateTripDetailDataInput {
  @Field(() => TripSectorDto)
  sector: TripSectorDto;
}
