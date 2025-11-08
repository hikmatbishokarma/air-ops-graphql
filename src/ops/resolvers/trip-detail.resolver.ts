import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TripDetailService } from '../services/trip-detail.service';
import { TripDetailDto, TripDocByCrewDto } from '../dto/trip-detail.dto';
import {
  UpdateTripDetailDataInput,
  UpdateTripDetailWhereInput,
} from '../inputs/update-trip-detail.input';
import { CreateTripInput } from '../inputs/create-trip.input';

import {
  TripDocByCrewWhereInput,
  TripFilterForCrewInput,
} from '../inputs/crew-assigned-trip.input';
import { PagingInput } from 'src/common/inputs/paging.input';
import { SortInput } from 'src/common/inputs/sorting.input';
import { TripAssignedForCrewResult } from '../dto/crew-assigned-trip.dto';

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

  @Mutation(() => TripDetailDto)
  async createTrip(@Args('input') input: CreateTripInput) {
    return await this.tripDetailService.createTrip(input);
  }

  @Query(() => TripAssignedForCrewResult)
  async tripAssignedForCrew(
    @Args('filter') filter: TripFilterForCrewInput,
    @Args('paging') paging: PagingInput,
    @Args({ name: 'sort', type: () => SortInput, nullable: true })
    sort?: SortInput,
  ) {
    return await this.tripDetailService.assignedSectorsForCrew(
      filter,
      paging,
      sort,
    );
  }

  @Mutation(() => TripDetailDto)
  async uploadTripDocByCrew(
    @Args('where') where: TripDocByCrewWhereInput,
    @Args('data') data: TripDocByCrewDto,
  ) {
    return await this.tripDetailService.uploadCrewTripDocument({ where, data });
  }
}
