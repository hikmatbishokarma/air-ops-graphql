import { Args, Resolver } from '@nestjs/graphql';
import { AccessRequestService } from '../services/access-request.service';
import { CurrentUser } from 'src/users/current-user.decorator';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';

@Resolver()
export class AccessRequestResolver {
  constructor(private readonly accessRequestService: AccessRequestService) {}

  async requestManualAccess(
    @Args('docId') docId: string,
    @CurrentUser() currentUser: CrewDetailDto,
  ) {
    return await this.accessRequestService.requestManualAccess(
      docId,
      currentUser,
    );
  }
}
