import { Args, ArgsType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TripDetailService } from '../services/trip-detail.service';
import { TripDetailDto, TripDocByCrewDto } from '../dto/trip-detail.dto';
import {
  UpdateTripDetailDataInput,
  UpdateTripDetailWhereInput,
} from '../inputs/update-trip-detail.input';
import { CreateTripInput } from '../inputs/create-trip.input';

import {
  TripDocByCrewDataInput,
  TripDocByCrewWhereInput,
  TripFilterForCrewInput,
} from '../inputs/crew-assigned-trip.input';
import { PagingInput } from 'src/common/inputs/paging.input';
import { SortInput } from 'src/common/inputs/sorting.input';
import { TripAssignedForCrewResult } from '../dto/crew-assigned-trip.dto';
import { QueryArgsType } from '@app/query-graphql';
import _ from 'lodash';
@ArgsType()
export class TripDetailQuery extends QueryArgsType(TripDetailDto) {}
export const TripDetailConnection = TripDetailQuery.ConnectionType;

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
    @Args('data') data: TripDocByCrewDataInput,
  ) {
    return await this.tripDetailService.uploadCrewTripDocument({ where, data });
  }

  @Query(() => TripDetailConnection, { name: 'tripDetailsWithCrewDocuments' })
  async tripDetailsWithCrewDocuments(
    @Args() query: TripDetailQuery,
  ): Promise<any> {
    return TripDetailConnection.createFromPromise(
      (q: any) => this.handleTripDocsQuery(q) as any,
      { ...query, ...query.filter },
      (q: any) => this.handleTripDocsCount(q),
    );
  }
  async handleTripDocsQuery(q: any) {
    const qCopy = _.cloneDeep(q);
    const baseFilter = qCopy.filter || {};

    const finalFilter = {
      ...baseFilter,
      sectors: {
        $elemMatch: {
          tripDocByCrew: { $exists: true, $ne: [] },
        },
      },
    };

    const records = await this.tripDetailService.Model.find(finalFilter)
      .sort(qCopy.sort || {})
      .skip(qCopy.paging?.skip ?? 0)
      .limit(qCopy.paging?.limit ?? 20);

    return records;
  }

  async handleTripDocsCount(q: any) {
    const baseFilter = q.filter || {};

    const finalFilter = {
      ...baseFilter,
      sectors: {
        $elemMatch: {
          tripDocByCrew: { $exists: true, $ne: [] },
        },
      },
    };

    return this.tripDetailService.Model.countDocuments(finalFilter);
  }
}
