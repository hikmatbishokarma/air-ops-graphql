import { Field, InputType } from '@nestjs/graphql';
import { TripSectorDto } from '../dto/trip-detail.dto';
import { FilterableField } from '@app/query-graphql';

@InputType()
export class TripDetailDto {
  @FilterableField()
  quotation: string;
  @FilterableField()
  quotationNo: string;
  @FilterableField({ nullable: true })
  operatorId: string;
  @Field(() => [TripSectorDto])
  sectors: TripSectorDto[];
}

@InputType()
export class CreateTripInput {
  @Field(() => TripDetailDto)
  tripDetail: TripDetailDto;
}
