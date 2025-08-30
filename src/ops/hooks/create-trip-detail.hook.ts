import { Injectable } from '@nestjs/common';
import { TripDetailDto } from '../dto/trip-detail.dto';
import { BeforeCreateOneHook, CreateOneInputType } from '@app/query-graphql';
import { GqlContextType } from '@nestjs/graphql';
import { TripDetailService } from '../services/trip-detail.service';

@Injectable()
export class CreateTripDetailHook<T extends TripDetailDto>
  implements BeforeCreateOneHook<T, GqlContextType>
{
  constructor(private readonly tripDetailService: TripDetailService) {}
  async run(
    instance: CreateOneInputType<T>,
    context: GqlContextType,
  ): Promise<CreateOneInputType<T>> {
    const { input } = instance;

    const tripId = await this.tripDetailService.generateTripId(
      input.operatorId,
    );

    input.sectors = input.sectors.map((sector, idx) => ({
      ...sector,
      sectorNo: idx + 1,
    }));

    input.tripId = tripId;

    return instance;
  }
}
