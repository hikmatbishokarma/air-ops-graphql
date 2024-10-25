import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserDTO } from '../dto/users.dto';
import { UsersService } from '../services/users.service';

@Resolver(() => UserDTO)
export class UsersResolver {
  constructor(private readonly userS: UsersService) {}

  @Query(() => String)
  async getUser(@Args('id') id: string) {
    return 'mnmnmn';
  }
}
