import { Field, ID, InputType } from '@nestjs/graphql';
import { SectorDto } from '../dto/passenger-detail.dto';

@InputType()
export class UpdatePassengerDetailWhereInput {
  @Field()
  quotationNo: string;

  @Field(() => ID, { nullable: true })
  quotation: string;
}

@InputType()
export class UpdatePassengerDetailDataInput {
  @Field(() => SectorDto)
  sector: SectorDto;
}
