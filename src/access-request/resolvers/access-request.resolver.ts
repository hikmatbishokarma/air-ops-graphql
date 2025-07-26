import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AccessRequestService } from '../services/access-request.service';
import { CurrentUser } from 'src/users/current-user.decorator';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { AccessRequestDto } from '../dto/access-request.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { AccessRequestStatus } from 'src/app-constants/enums';

@Resolver()
export class AccessRequestResolver {
  constructor(private readonly accessRequestService: AccessRequestService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AccessRequestDto)
  async requestManualAccess(
    @Args('docId') docId: string,
    @CurrentUser() currentUser,
  ) {
    return await this.accessRequestService.requestManualAccess(
      docId,
      currentUser,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AccessRequestDto)
  async updateAccessRequestStatus(
    @Args('status', { type: () => AccessRequestStatus })
    status: AccessRequestStatus,
    @Args('notificationId') notificationId: string,
    @CurrentUser() currentUser,
  ) {
    return await this.accessRequestService.updateAccessRequestStatus(
      status,
      notificationId,
      currentUser,
    );
  }
}
