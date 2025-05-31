import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { OperatorService } from '../services/operator.service';
import { OperatorDto } from '../dto/operator.dto';
import { CurrentUser } from 'src/users/current-user.decorator';
import { UserDTO } from 'src/users/dto/users.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { GqlRolesGuard } from 'src/roles/gql-roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleType } from 'src/app-constants/enums';

@Resolver(() => OperatorDto)
export class OperatorResolver {
  constructor(private readonly operatorService: OperatorService) {}

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  @Mutation(() => OperatorDto)
  async createOperator(
    @Args('operator') operator: OperatorDto,
    @CurrentUser() currentUser: UserDTO, // ← Get user here
  ) {
    return await this.operatorService.createOperator(operator, currentUser);
  }

  @ResolveField('createdByUser', () => UserDTO, { nullable: true })
  async getCreatedByUser(@Parent() operator: any): Promise<any> {
    const createdByUser = await this.operatorService.getUserById(
      operator.createdBy,
    );
    return createdByUser;
  }
}
