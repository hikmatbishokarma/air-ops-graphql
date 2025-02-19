import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDTO } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { CreateUserInput } from '../inputs/user.input';

@Resolver(() => UserDTO)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => String)
  async getUser(@Args('id') id: string) {
    return 'mnmnmn';
  }

  @Mutation(() => UserDTO)
  async createOneUser(@Args('input') input: CreateUserInput) {
    return await this.userService.createOneUser(input.user);
  }
}
