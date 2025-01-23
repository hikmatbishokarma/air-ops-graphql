import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { signInDTO } from '../dto/auth.dto';
import { AuthGuard } from '../auth.guard';

import { RolesGuard } from 'src/roles/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: signInDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.User)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
