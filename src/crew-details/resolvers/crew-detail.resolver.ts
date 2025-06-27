import { Args, Query, Resolver } from '@nestjs/graphql';
import { CertificationResponse, CrewDetailDto } from '../dto/crew-detail.dto';
import { CrewDetailService } from '../services/crew-detail.service';
import { GraphQLJSONObject } from 'graphql-type-json';
import { StaffCertificationInput } from '../inputs/crew-detail-staff-certification-input';

@Resolver()
export class CrewDetailResolver {
  constructor(private readonly crewDetailService: CrewDetailService) {}

  @Query(() => CertificationResponse, { name: 'staffCertificates' })
  async staffCertificates(
    @Args('args', { nullable: true }) args: StaffCertificationInput,
  ) {
    const result = await this.crewDetailService.staffCertificates(args);

    return result;
  }
}
