import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TripDetailService } from '../services/trip-detail.service';
import { TripDetailDto } from '../dto/trip-detail.dto';
import {
  UpdateTripDetailDataInput,
  UpdateTripDetailWhereInput,
} from '../inputs/update-trip-detail.input';

@Resolver()
export class TripDetailResolver {
  constructor(private readonly tripDetailService: TripDetailService) {}

  @Mutation(() => TripDetailDto)
  async updateTripDetail(
    @Args('where') where: UpdateTripDetailWhereInput,
    @Args('data') data: UpdateTripDetailDataInput,
  ) {
    return await this.tripDetailService.updateTripDetail({ where, data });
  }
}
