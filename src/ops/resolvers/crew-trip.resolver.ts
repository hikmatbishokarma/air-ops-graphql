import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CrewDetailService } from 'src/crew-details/services/crew-detail.service';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { AssignedCrewDto, TripDocByCrewDto } from '../dto/trip-detail.dto';

@Resolver(() => TripDocByCrewDto)
export class CrewTripUploadedDocResolver {
  constructor(private crewService: CrewDetailService) { }

  @ResolveField(() => CrewDetailDto, { name: 'crewDetails' })
  async getCrewDetails(@Parent() doc: TripDocByCrewDto) {
    if (!doc.crew) return null;
    return await this.crewService.findById(doc.crew); // crew is ObjectId stored in DB
  }
}

@Resolver(() => AssignedCrewDto)
export class AssignedCrewResolver {
  constructor(private crewService: CrewDetailService) { }

  @ResolveField(() => [CrewDetailDto], { name: 'crewsInfo' })
  async getCrewDetails(@Parent() doc: AssignedCrewDto) {

    if (!doc.crews) return null;
    return await this.crewService.query({ filter: { id: { in: doc.crews } }, projection: { fullName: 1, displayName: 1, crewId: 1, email: 1 } })

  }
}
