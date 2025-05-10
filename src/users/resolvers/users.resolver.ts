import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserDTO } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { CreateUserInput } from '../inputs/user.input';
import { CurrentUser } from '../current-user.decorator';

@Resolver(() => UserDTO)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => String)
  async getUser(@Args('id') id: string) {
    return 'mnmnmn';
  }

  @Mutation(() => UserDTO)
  async createOneUser(
    @Args('input') input: CreateUserInput,
    @CurrentUser() currentUser: UserDTO, // ← Get user here
  ) {
    return await this.userService.createOneUser(input.user, currentUser);
  }

  @ResolveField('createdByUser', () => UserDTO, { nullable: true })
  async getCreatedByUser(@Parent() user: any): Promise<any> {
    const createdByUser = await this.userService.findById(user.createdBy);
    return createdByUser;
  }
}
