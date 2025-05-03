import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AgentService } from '../services/agent.service';
import { AgentDto } from '../dto/agent.dto';
import { CurrentUser } from 'src/users/current-user.decorator';
import { UserDTO } from 'src/users/dto/users.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { GqlRolesGuard } from 'src/roles/gql-roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleType } from 'src/app-constants/enums';

@Resolver()
export class AgentResolver {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  @Mutation(() => AgentDto)
  async createAgent(
    @Args('agent') agent: AgentDto,
    @CurrentUser() user: UserDTO, // ← Get user here
  ) {
    console.log('user:::', user); // ← Log user object here
    return await this.agentService.createAgent(agent);
  }
}
