import { Injectable } from '@nestjs/common';
import { AircraftDetailDto } from '../dto/aircraft-detail.dto';
import { GqlContextType } from '@nestjs/graphql';
import { BeforeDeleteOneHook, DeleteOneInputType } from '@app/query-graphql';
import { AircraftDetailService } from '../services/aircraft-detail.service';

@Injectable()
export class DeleteAircarftDetailHook<T extends AircraftDetailDto>
  implements BeforeDeleteOneHook<GqlContextType>
{
  constructor(private readonly aircraftDetailService: AircraftDetailService) {}
  async run(
    instance: DeleteOneInputType,
    context: GqlContextType,
  ): Promise<DeleteOneInputType> {
    const { id } = instance;

    await this.aircraftDetailService.checkIfAircraftDetailPresentInQuote(id);

    return instance;
  }
}
