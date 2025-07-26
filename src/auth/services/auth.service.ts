import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';

import {
  comparePassword,
  generatePassword,
  hashPassword,
} from 'src/common/helper';
import { loginResponseDto } from '../dto/login-response.dto';
import { LoginInput } from '../inputs/login.input';
import { SignInInput } from '../inputs/sign-in.input';
import { SignUpInput } from '../inputs/sign-up.input';
import { RoleType } from 'src/app-constants/enums';
import { CrewAuthService } from 'src/crew-details/services/crew-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private crewAuthService: CrewAuthService,
  ) {}

  //#region  IF USER
  // async signIn({ userName, password }: SignInInput): Promise<any> {
  //   const {
  //     email,
  //     password: pwd,
  //     roles,
  //     id,
  //     ...rest
  //   } = await this.usersService.getUserByUserName(userName);

  //   const isMatch = await comparePassword(password, pwd);
  //   if (!isMatch) throw new UnauthorizedException();
  //   const payload = {
  //     sub: id,
  //     email,
  //     roles,
  //   };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //     user: {
  //       id,
  //       email,
  //       roles,
  //       ...rest,
  //     },
  //   };
  // }

  // async signUp(args: SignUpInput) {
  //   let { name, email, password } = args;

  //   if (!password) throw new Error('password is required');
  //   password = await hashPassword(password);

  //   const role = await this.usersService.getRoleByType(RoleType.ADMIN);
  //   const payload = {
  //     name,
  //     email,
  //     password,
  //     role: role?.id,
  //   };

  //   const createUser = await this.usersService.createOne(payload);
  //   if (!createUser) throw new Error('Failed To Signup User');
  //   return createUser;
  // }

  // async forgotPassword(email: string) {
  //   return await this.usersService.forgotPassword(email);
  // }

  // async resetPassword(args) {
  //   const { userId, currentPwd, newPwd, confirmPwd } = args;
  //   return await this.usersService.resetPassword(
  //     userId,
  //     currentPwd,
  //     newPwd,
  //     confirmPwd,
  //   );
  // }

  //#endregion

  //#region FOR CREW

  async signIn({ userName, password }: SignInInput): Promise<any> {
    const {
      email,
      password: pwd,
      roles,
      id,
      ...rest
    } = await this.crewAuthService.getUserByUserName(userName);

    const isMatch = await comparePassword(password, pwd);
    if (!isMatch) throw new UnauthorizedException();
    const payload = {
      sub: id,
      email,
      roles,
      name: rest?.displayName || rest?.fullName || '',
      profile: rest.profile || '',
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id,
        email,
        roles,
        ...rest,
      },
    };
  }

  async signUp(args: SignUpInput) {
    let { name, email, password } = args;

    if (!password) throw new Error('password is required');
    password = await hashPassword(password);

    const role = await this.crewAuthService.getRoleByType(RoleType.ADMIN);
    const payload = {
      name,
      email,
      password,
      role: role?.id,
    };

    const createUser = await this.crewAuthService.createOne(payload);
    if (!createUser) throw new Error('Failed To Signup User');
    return createUser;
  }

  async forgotPassword(email: string) {
    return await this.crewAuthService.forgotPassword(email);
  }

  async resetPassword(args) {
    const { userId, currentPwd, newPwd, confirmPwd } = args;
    return await this.crewAuthService.resetPassword(
      userId,
      currentPwd,
      newPwd,
      confirmPwd,
    );
  }

  //#endregion
}
