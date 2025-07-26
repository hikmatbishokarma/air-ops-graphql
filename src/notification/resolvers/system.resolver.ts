import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SystemNotificationService } from '../services/system.service';

import { SystemNotificationDto } from '../dto/system.dto';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { CurrentUser } from 'src/users/current-user.decorator';
import {
  MarkAsReadInput,
  SystemNotificationWhereInput,
} from '../inputs/system.input';

@Resolver()
export class SystemNotificationResolver {
  constructor(
    private readonly systemNotificationService: SystemNotificationService,
  ) {}

  @Query(() => [SystemNotificationDto])
  async systemNotifications(
    @Args('where', { nullable: true }) where: SystemNotificationWhereInput,
    @CurrentUser() currentUser,
  ) {
    return await this.systemNotificationService.systemNotifications(
      where,
      currentUser,
    );
  }

  @Mutation(() => Boolean)
  async markNotificationsAsRead(@Args('input') input: MarkAsReadInput) {
    return await this.systemNotificationService.markNotificationsAsRead(input);
  }
}
