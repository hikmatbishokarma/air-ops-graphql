import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { RoleType } from 'src/app-constants/enums';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { GqlRolesGuard } from 'src/roles/gql-roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { CurrentUser } from 'src/users/current-user.decorator';

@Resolver()
export class ManualResolver {
  constructor() {}
}
