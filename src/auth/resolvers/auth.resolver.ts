import { Args, Query, Resolver } from '@nestjs/graphql';
import { LoginInputs } from '../inputs/login.input';
import { AuthService } from '../services/auth.service';
import { loginResponseDTO } from '../dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => loginResponseDTO)
  async login(@Args('input') input: LoginInputs) {
    console.log('input', input);
    return await this.authService.login(input);
  }
}
