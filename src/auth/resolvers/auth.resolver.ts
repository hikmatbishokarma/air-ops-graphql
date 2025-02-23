import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { loginResponseDto } from '../dto/login-response.dto';
import { LoginInput } from '../inputs/login.input';
import { SignInInput } from '../inputs/sign-in.input';
import { SignUpInput } from '../inputs/sign-up.input';
import { UserDTO } from 'src/users/dto/users.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // @Query(() => loginResponseDto)
  // async login(@Args('input') input: LoginInput) {
  //   console.log('input', input);
  //   return await this.authService.login(input);
  // }

  @Query(() => loginResponseDto)
  async signIn(@Args('input') input: SignInInput) {
    return await this.authService.signIn(input);
  }

  @Mutation(() => UserDTO)
  async signUp(@Args('input') input: SignUpInput) {
    return await this.authService.signUp(input);
  }

  @Mutation(() => ForgotPasswordDto)
  async forgotPassword(@Args('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Mutation(() => ResetPasswordDto)
  async resetPassword(@Args('input') input: ResetPasswordInput) {
    return await this.authService.resetPassword(input);
  }
}
