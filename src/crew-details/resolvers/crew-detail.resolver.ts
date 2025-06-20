import { Args, Query, Resolver } from '@nestjs/graphql';
import { CrewDetailDto } from '../dto/crew-detail.dto';
import { CrewDetailService } from '../services/crew-detail.service';

@Resolver()
export class CrewDetailResolver {
  constructor(private readonly crewDetailService: CrewDetailService) {}

  @Query(() => CrewDetailDto, { name: 'staffCertificates' })
  async staffCertificates(
    @Args('validTillBefore', { nullable: true }) validTillBefore: Date,
    @Args('search', { nullable: true }) search: string,
  ) {
    return await this.crewDetailService.staffCertificates(
      validTillBefore,
      search,
    );
  }
}
