import { Field, InputType } from '@nestjs/graphql';
import { TripSectorDto } from '../dto/trip-detail.dto';

@InputType()
export class UpdateTripDetailWhereInput {
  @Field()
  tripId: string;
}

@InputType()
export class UpdateTripDetailDataInput {
  @Field(() => TripSectorDto)
  sector: TripSectorDto;
}
