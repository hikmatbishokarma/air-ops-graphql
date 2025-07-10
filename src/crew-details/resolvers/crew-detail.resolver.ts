import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CertificationResponse, CrewDetailDto } from '../dto/crew-detail.dto';
import { CrewDetailService } from '../services/crew-detail.service';
import { GraphQLJSONObject } from 'graphql-type-json';
import { StaffCertificationInput } from '../inputs/crew-detail-staff-certification-input';
import { CrewAuthService } from '../services/crew-auth.service';
import { CreateCrewInput, CrewInput } from '../inputs/crew-detail.input';
import { CurrentUser } from 'src/users/current-user.decorator';

@Resolver()
export class CrewDetailResolver {
  constructor(
    private readonly crewDetailService: CrewDetailService,
    private readonly crewAuthService: CrewAuthService,
  ) {}

  @Query(() => CertificationResponse, { name: 'staffCertificates' })
  async staffCertificates(
    @Args('args', { nullable: true }) args: StaffCertificationInput,
  ) {
    const result = await this.crewDetailService.staffCertificates(args);

    return result;
  }

  @Mutation(() => CrewDetailDto)
  async createOneUser(
    @Args('input') input: CreateCrewInput,
    @CurrentUser() currentUser: CrewDetailDto, // ← Get user here
  ) {
    return await this.crewAuthService.createCrew(input.crew, currentUser);
  }

  @ResolveField('createdByUser', () => CrewDetailDto, { nullable: true })
  async getCreatedByUser(@Parent() user: any): Promise<any> {
    const createdByUser = await this.crewDetailService.findById(user.createdBy);
    return createdByUser;
  }
}
