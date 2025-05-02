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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async login({ userName, password }: LoginInput): Promise<loginResponseDto> {
  //   console.log(userName, password);
  //   const user = await this.usersService.getUserByUserName(userName);

  //   if (!user) throw new Error('User not found');

  //   const isMatch = await comparePassword(password, user.password);
  //   if (!isMatch) throw new UnauthorizedException();
  //   const payload = {
  //     sub: user.id,
  //     userName,
  //     roleType: user.roleType,
  //     role: { roleType: user?.role?.roleType, name: user?.role.name },
  //   };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //     user: { name: user.name, email: user.email, roleType: user.roleType,accessPermission:[] },
  //   };
  // }

  async signIn({ userName, password }: SignInInput): Promise<any> {
    console.log(userName, password);
    const user = await this.usersService.getUserByUserName(userName);

    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    const payload = {
      sub: user.id,
      userName,
      role: {
        type: user?.role?.type,
        name: user?.role.name,
        accessPermissions: user.role.accessPermissions,
      },
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user?.role?.type,
        role: payload.role,
        image: user.image,
      },
    };
  }

  async signUp(args: SignUpInput) {
    let { name, email, password } = args;

    if (!password) throw new Error('password is required');
    password = await hashPassword(password);

    const role = await this.usersService.getRoleByType(RoleType.USER);
    const payload = {
      name,
      email,
      password,
      role: role?.id,
    };

    const createUser = await this.usersService.createOne(payload);
    if (!createUser) throw new Error('Failed To Signup User');
    return createUser;
  }

  async forgotPassword(email: string) {
    return await this.usersService.forgotPassword(email);
  }

  async resetPassword(args) {
    const { userId, currentPwd, newPwd, confirmPwd } = args;
    return await this.usersService.resetPassword(
      userId,
      currentPwd,
      newPwd,
      confirmPwd,
    );
  }
}
