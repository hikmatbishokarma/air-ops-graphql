import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { loginResponseDto } from '../dto/login-response.dto';
import { LoginInput } from '../inputs/login.input';
import { SignInInput } from '../inputs/sign-in.input';
import { SignUpInput } from '../inputs/sign-up.input';
import { UserDTO } from 'src/users/dto/users.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => loginResponseDto)
  async login(@Args('input') input: LoginInput) {
    console.log('input', input);
    return await this.authService.login(input);
  }

  @Query(() => loginResponseDto)
  async signIn(@Args('input') input: SignInInput) {
    return await this.authService.signIn(input);
  }

  @Mutation(() => UserDTO)
  async signUp(@Args('input') input: SignUpInput) {
    return await this.authService.signUp(input);
  }
}
