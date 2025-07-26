import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './resolvers/auth.resolver';
import { CrewDetailModule } from 'src/crew-details/crew-detail.module';

@Module({
  imports: [
    UsersModule,
    CrewDetailModule,
    JwtModule.register({
      global: true,
      secret: '1234', //TODO: Do not expose this key publicly.
      signOptions: { expiresIn: '2 days' },
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
