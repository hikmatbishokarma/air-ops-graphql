import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { LoginInputs } from '../inputs/login.input';
import { comparePassword } from 'src/common/helper';
import { loginResponseDTO } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const [user] = await this.usersService.query({
      filter: { name: { eq: username } },
    });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name, roles: ['user'] };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login({ username, password }: LoginInputs): Promise<loginResponseDTO> {
    console.log(username, password);
    const [user] = await this.usersService.query({
      filter: {
        or: [{ email: { eq: username } }, { phone: { eq: username } }],
      },
    });

    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    const payload = { sub: user.id, username, roleType: user.roleType };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
